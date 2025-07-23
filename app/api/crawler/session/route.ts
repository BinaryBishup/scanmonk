import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Create a new crawl session
export async function POST(request: NextRequest) {
  try {
    const { name, totalDomains } = await request.json()
    
    const session = await prisma.crawlSession.create({
      data: {
        name,
        totalDomains,
        status: 'running'
      }
    })
    
    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

// Get crawl sessions
export async function GET(request: NextRequest) {
  try {
    const sessions = await prisma.crawlSession.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { results: true }
        }
      }
    })
    
    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}