import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { priceMin, priceMax, beds, baths, propertyType } = body;

    const where: any = {};

    if (priceMin) where.price = { ...where.price, gte: parseInt(priceMin) };
    if (priceMax) where.price = { ...where.price, lte: parseInt(priceMax) };
    if (beds) where.beds = { gte: parseInt(beds) };
    if (baths) where.baths = { gte: parseFloat(baths) };
    if (propertyType && propertyType !== 'all') where.propertyType = propertyType;

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ results: listings, count: listings.length });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
