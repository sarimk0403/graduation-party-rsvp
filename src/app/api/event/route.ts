import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get the first event (since we only have one for now)
    const event = await prisma.event.findFirst();
    
    if (!event) {
      return NextResponse.json(
        { error: 'No event found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 