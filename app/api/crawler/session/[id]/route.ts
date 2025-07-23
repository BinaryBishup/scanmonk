import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get session details with results
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await prisma.crawlSession.findUnique({
      where: { id },
      include: {
        results: {
          orderBy: { createdAt: 'desc' },
          take: 100 // Limit to last 100 results for performance
        }
      }
    })
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      session: {
        ...session,
        results: undefined // Remove results from session object
      },
      results: session.results 
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}

// Update session status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()
    
    const session = await prisma.crawlSession.update({
      where: { id },
      data: { status }
    })
    
    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
}