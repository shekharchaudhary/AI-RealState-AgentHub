import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Add a property to favorites
export async function POST(request: NextRequest) {
  try {
    const { listingId, notes } = await request.json();

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Get demo user (in production, this would be from session/auth)
    const user = await prisma.user.findUnique({
      where: { email: 'demo@nestora.com' },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId: listingId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Property already saved', favorite: existingFavorite },
        { status: 409 }
      );
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        listingId: listingId,
        notes: notes || null,
      },
      include: {
        listing: true,
      },
    });

    return NextResponse.json({
      message: 'Property saved successfully',
      favorite,
    });
  } catch (error) {
    console.error('Error saving favorite:', error);
    return NextResponse.json(
      { error: 'Failed to save property' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a property from favorites
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@nestora.com' },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete favorite
    const deleted = await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        listingId: listingId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Property removed from favorites',
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove property' },
      { status: 500 }
    );
  }
}

// GET - Check if a property is favorited
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Get demo user
    const user = await prisma.user.findUnique({
      where: { email: 'demo@nestora.com' },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if favorited
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId: listingId,
        },
      },
    });

    return NextResponse.json({
      isFavorited: !!favorite,
      favorite: favorite || null,
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return NextResponse.json(
      { error: 'Failed to check favorite status' },
      { status: 500 }
    );
  }
}
