import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Retrieve all tours for the user
export async function GET(request: NextRequest) {
  try {
    // Get the demo user (in production, you'd get this from auth session)
    const user = await prisma.user.findUnique({
      where: { email: 'demo@nestora.com' },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch all tours for this user, including listing details
    const tours = await prisma.tour.findMany({
      where: { userId: user.id },
      include: {
        listing: true,
      },
      orderBy: {
        start: 'asc',
      },
    });

    return NextResponse.json({ tours });
  } catch (error) {
    console.error('Get tours error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve tours' },
      { status: 500 }
    );
  }
}

// POST: Schedule a new tour
export async function POST(request: NextRequest) {
  try {
    const { listingId, start, end, notes } = await request.json();

    if (!listingId || !start || !end) {
      return NextResponse.json(
        { error: 'Missing required fields: listingId, start, end' },
        { status: 400 }
      );
    }

    // Get the demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@nestora.com' },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify the listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create the tour
    const tour = await prisma.tour.create({
      data: {
        userId: user.id,
        listingId: listingId,
        start: new Date(start),
        end: new Date(end),
        status: 'requested',
      },
      include: {
        listing: true,
      },
    });

    return NextResponse.json({
      message: 'Tour scheduled successfully',
      tour,
    });
  } catch (error) {
    console.error('Schedule tour error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule tour' },
      { status: 500 }
    );
  }
}

// DELETE: Cancel a tour
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');

    if (!tourId) {
      return NextResponse.json(
        { error: 'Tour ID is required' },
        { status: 400 }
      );
    }

    // Get the demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@nestora.com' },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify the tour belongs to this user
    const tour = await prisma.tour.findFirst({
      where: {
        id: tourId,
        userId: user.id,
      },
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Update status to cancelled instead of deleting
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: { status: 'cancelled' },
      include: {
        listing: true,
      },
    });

    return NextResponse.json({
      message: 'Tour cancelled successfully',
      tour: updatedTour,
    });
  } catch (error) {
    console.error('Cancel tour error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel tour' },
      { status: 500 }
    );
  }
}
