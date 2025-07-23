import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Shopify detection patterns based on the Python crawler
const SHOPIFY_HEADER_KEYS = ['x-shopify-stage', 'x-shopify-cache-status']
const SHOPIFY_HTML_PATTERNS = [
  /cdn\.shopify\.com/i,
  /<meta[^>]+name=["']shopify-digital-wallet["']/i,
  /window\.Shopify/i,
]

interface CrawlResult {
  domain: string
  businessName: string
  isShopify: boolean
  timestamp: string
  status: 'success' | 'error'
  errorMessage?: string
  headers?: any
}

async function checkDomain(domain: string): Promise<CrawlResult> {
  const url = domain.startsWith('http') ? domain : `https://${domain}`
  const timestamp = new Date().toISOString()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShopifyScanner/1.0)',
      },
    })
    
    clearTimeout(timeoutId)
    
    const text = await response.text()
    const headers = response.headers
    
    // Check if it's a Shopify site
    const hasShopifyHeaders = SHOPIFY_HEADER_KEYS.some(key => 
      headers.has(key)
    )
    
    const hasShopifyPatterns = SHOPIFY_HTML_PATTERNS.some(pattern =>
      pattern.test(text)
    )
    
    const isShopify = hasShopifyHeaders || hasShopifyPatterns
    
    let businessName = ''
    if (isShopify) {
      businessName = extractBusinessName(text)
    }
    
    return {
      domain,
      businessName,
      isShopify,
      timestamp,
      status: 'success',
    }
  } catch (error) {
    return {
      domain,
      businessName: '',
      isShopify: false,
      timestamp,
      status: 'error',
    }
  }
}

function extractBusinessName(html: string): string {
  // Try to extract from LD+JSON
  const ldJsonMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/is)
  if (ldJsonMatch) {
    try {
      const data = JSON.parse(ldJsonMatch[1])
      if (data['@type'] === 'Organization' && data.name) {
        return data.name.trim()
      }
      if (Array.isArray(data)) {
        for (const entry of data) {
          if (entry['@type'] === 'Organization' && entry.name) {
            return entry.name.trim()
          }
        }
      }
    } catch {}
  }
  
  // Try og:site_name
  const ogSiteMatch = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i)
  if (ogSiteMatch) {
    return ogSiteMatch[1].trim()
  }
  
  // Try og:title
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
  if (ogTitleMatch) {
    return ogTitleMatch[1].trim()
  }
  
  // Try regular title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch) {
    return titleMatch[1].trim()
  }
  
  return ''
}

export async function POST(request: NextRequest) {
  try {
    const { domains, batchSize = 10, sessionId } = await request.json()
    
    if (!domains || !Array.isArray(domains)) {
      return NextResponse.json({ error: 'Invalid domains array' }, { status: 400 })
    }
    
    // Process domains in batches
    const results: CrawlResult[] = []
    
    for (let i = 0; i < domains.length; i += batchSize) {
      const batch = domains.slice(i, i + batchSize)
      const batchPromises = batch.map(domain => checkDomain(domain))
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
      
      // Save results to database if sessionId is provided
      if (sessionId) {
        const dbResults = await Promise.all(
          batchResults.map(result => 
            prisma.crawlResult.create({
              data: {
                domain: result.domain,
                businessName: result.businessName || null,
                isShopify: result.isShopify,
                status: result.status,
                errorMessage: result.errorMessage || null,
                headers: result.headers || null,
                sessionId: sessionId
              }
            })
          )
        )
        
        // Update session stats
        const shopifyCount = batchResults.filter(r => r.isShopify).length
        await prisma.crawlSession.update({
          where: { id: sessionId },
          data: {
            processedDomains: { increment: batchResults.length },
            shopifyDomains: { increment: shopifyCount }
          }
        })
      }
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < domains.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error processing domains:', error)
    return NextResponse.json({ error: 'Failed to process domains' }, { status: 500 })
  }
}