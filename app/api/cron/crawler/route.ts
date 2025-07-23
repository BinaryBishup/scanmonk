import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Vercel cron job to run scheduled crawls
// Add to vercel.json: { "crons": [{ "path": "/api/cron/crawler", "schedule": "0 0 * * *" }] }
// Note: Runs daily at midnight UTC (Hobby accounts limited to daily cron jobs)
export async function GET(request: NextRequest) {
  try {
    // Check if this is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get active scheduled crawls
    const scheduledCrawls = await prisma.scheduledCrawl.findMany({
      where: { isActive: true }
    })
    
    for (const crawl of scheduledCrawls) {
      // Create a new session for this crawl
      const session = await prisma.crawlSession.create({
        data: {
          name: `Scheduled: ${crawl.name}`,
          totalDomains: crawl.domains.length,
          status: 'running'
        }
      })
      
      // Process domains in batches
      const batchSize = 10
      for (let i = 0; i < crawl.domains.length; i += batchSize) {
        const batch = crawl.domains.slice(i, i + batchSize)
        
        // Call the crawler API
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/crawler`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domains: batch,
            sessionId: session.id,
            batchSize: batchSize
          })
        })
      }
      
      // Update the scheduled crawl
      await prisma.scheduledCrawl.update({
        where: { id: crawl.id },
        data: { lastRun: new Date() }
      })
      
      // Mark session as completed
      await prisma.crawlSession.update({
        where: { id: session.id },
        data: { status: 'completed' }
      })
    }
    
    return NextResponse.json({ 
      message: 'Scheduled crawls processed',
      count: scheduledCrawls.length 
    })
  } catch (error) {
    console.error('Cron error:', error)
    return NextResponse.json({ error: 'Failed to process scheduled crawls' }, { status: 500 })
  }
}