import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { RsvpStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create a new guest with RSVP status
    const newGuest = await prisma.guest.create({
      data: {
        name: body.name,
        email: body.email,
        rsvpStatus: body.attending === 'yes' ? 'ATTENDING' : 'NOT_ATTENDING',
        additionalGuests: body.attending === 'yes' ? body.additionalGuests : 0,
        notes: body.message,
        event: {
          connect: {
            id: body.eventId
          }
        }
      },
    });

    return NextResponse.json({ success: true, guest: newGuest });
  } catch (error) {
    console.error('Error saving RSVP:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save RSVP',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      include: {
        event: true
      }
    });
    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error reading RSVPs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to read RSVPs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await prisma.guest.delete({
      where: {
        id: id
      }
    });

    return NextResponse.json({ message: "RSVP deleted successfully" });
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    return NextResponse.json(
      { error: "Failed to delete RSVP" },
      { status: 500 }
    );
  }
} 