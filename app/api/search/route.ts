import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Calculate distance between two coordinates using Haversine formula (in miles)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { priceMin, priceMax, beds, baths, propertyType, location, searchLat, searchLng } = body;

    const where: any = {};

    if (priceMin) where.price = { ...where.price, gte: parseInt(priceMin) };
    if (priceMax) where.price = { ...where.price, lte: parseInt(priceMax) };
    if (beds) where.beds = { gte: parseInt(beds) };
    if (baths) where.baths = { gte: parseFloat(baths) };
    if (propertyType && propertyType !== 'all') where.propertyType = propertyType;

    // Add location-based filtering if location is specified
    if (location) {
      // Case-insensitive partial match on address
      where.address = {
        contains: location,
        mode: 'insensitive',
      };
    }

    let listings = await prisma.listing.findMany({
      where,
      take: 100, // Increase limit to get more results for sorting
    });

    // Sort by proximity if search coordinates are provided
    if (searchLat && searchLng) {
      listings = listings
        .map((listing) => ({
          ...listing,
          distance: calculateDistance(searchLat, searchLng, listing.lat, listing.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 50); // Return top 50 closest results
    } else {
      // Default sorting by creation date
      listings = listings.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 50);
    }

    return NextResponse.json({ results: listings, count: listings.length });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
