import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate that the ID is provided
    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Fetch the property from the database
    const property = await prisma.listing.findUnique({
      where: { id },
      include: {
        tours: {
          take: 5,
          orderBy: { start: 'desc' },
        },
        offers: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Return 404 if property not found
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Return the property data
    return NextResponse.json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}
