import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating demo user and sample data...');

  // Create or get demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@nestora.com' },
    update: {},
    create: {
      email: 'demo@nestora.com',
      name: 'Demo User',
      phone: '(650) 555-0123',
      role: 'BUYER',
    },
  });

  console.log('Demo user created:', user.email);

  // Get some random listings to work with
  const listings = await prisma.listing.findMany({ take: 10 });

  if (listings.length === 0) {
    console.log('No listings found. Please run the main seed first.');
    return;
  }

  // Create 5 favorites
  const favoritesData = listings.slice(0, 5).map((listing, index) => ({
    userId: user.id,
    listingId: listing.id,
    notes: index === 0 ? 'Perfect location near schools!' :
           index === 1 ? 'Love the backyard space' :
           index === 2 ? 'Great price for the area' : null,
  }));

  for (const fav of favoritesData) {
    await prisma.favorite.upsert({
      where: {
        userId_listingId: {
          userId: fav.userId,
          listingId: fav.listingId,
        },
      },
      update: {},
      create: fav,
    });
  }

  console.log('Created 5 favorite properties');

  // Create 3 scheduled tours
  const now = new Date();
  const toursData = [
    {
      userId: user.id,
      listingId: listings[0].id,
      start: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      end: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
      status: 'confirmed',
    },
    {
      userId: user.id,
      listingId: listings[1].id,
      start: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      end: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      status: 'confirmed',
    },
    {
      userId: user.id,
      listingId: listings[2].id,
      start: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      status: 'requested',
    },
  ];

  // Delete existing tours for demo user to avoid duplicates
  await prisma.tour.deleteMany({ where: { userId: user.id } });

  for (const tour of toursData) {
    await prisma.tour.create({ data: tour });
  }

  console.log('Created 3 scheduled tours');

  // Create 2 active offers
  const offersData = [
    {
      userId: user.id,
      listingId: listings[3].id,
      price: Math.floor(listings[3].price * 0.95), // 5% below asking
      downPayment: Math.floor(listings[3].price * 0.2), // 20% down
      contingencies: ['Inspection', 'Financing', 'Appraisal'],
      status: 'pending',
    },
    {
      userId: user.id,
      listingId: listings[4].id,
      price: listings[4].price, // At asking price
      downPayment: Math.floor(listings[4].price * 0.25), // 25% down
      contingencies: ['Inspection'],
      status: 'accepted',
    },
  ];

  // Delete existing offers for demo user
  await prisma.offer.deleteMany({ where: { userId: user.id } });

  for (const offer of offersData) {
    await prisma.offer.create({ data: offer });
  }

  console.log('Created 2 active offers');

  console.log('\n✅ Demo user data seeded successfully!');
  console.log(`User ID: ${user.id}`);
  console.log(`Email: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
