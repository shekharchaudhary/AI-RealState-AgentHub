import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // For demo purposes, we'll use the demo user
    // In production, this would use the authenticated user's ID
    const user = await prisma.user.findUnique({
      where: { email: 'demo@nestora.com' },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch all dashboard data in parallel for better performance
    const [favorites, tours, offers] = await Promise.all([
      // Get favorite properties with listing details
      prisma.favorite.findMany({
        where: { userId: user.id },
        include: {
          listing: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Get scheduled tours with listing details
      prisma.tour.findMany({
        where: {
          userId: user.id,
          start: { gte: new Date() }, // Only future tours
        },
        include: {
          listing: true,
        },
        orderBy: { start: 'asc' },
      }),

      // Get active offers with listing details
      prisma.offer.findMany({
        where: {
          userId: user.id,
          status: { in: ['draft', 'pending', 'accepted', 'countered'] },
        },
        include: {
          listing: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Calculate stats
    const stats = {
      savedProperties: favorites.length,
      scheduledTours: tours.length,
      activeOffers: offers.length,
    };

    // Get recent activity (last 10 items across favorites, tours, offers)
    const recentActivity = [
      ...favorites.map((f) => ({
        id: f.id,
        type: 'favorite',
        message: `Saved ${f.listing.address}`,
        timestamp: f.createdAt,
        listing: f.listing,
      })),
      ...tours.map((t) => ({
        id: t.id,
        type: 'tour',
        message: `Scheduled tour at ${t.listing.address}`,
        timestamp: t.createdAt,
        listing: t.listing,
        tourDate: t.start,
        status: t.status,
      })),
      ...offers.map((o) => ({
        id: o.id,
        type: 'offer',
        message: `Made offer on ${o.listing.address}`,
        timestamp: o.createdAt,
        listing: o.listing,
        price: o.price,
        status: o.status,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      stats,
      favorites,
      tours,
      offers,
      recentActivity,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
