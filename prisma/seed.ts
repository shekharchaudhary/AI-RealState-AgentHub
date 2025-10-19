import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Sample listings
  const listings = [
    {
      address: '123 Oak Street, Palo Alto, CA 94301',
      lat: 37.4419,
      lng: -122.1430,
      price: 2800000,
      beds: 4,
      baths: 3.5,
      sqft: 2800,
      lotSqft: 6500,
      hoaMonthly: 0,
      propertyType: 'house',
      yearBuilt: 2018,
      photos: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994'],
      features: ['Hardwood floors', 'Modern kitchen', 'Solar panels', 'Landscaped yard'],
    },
    {
      address: '456 Elm Avenue, Mountain View, CA 94040',
      lat: 37.3861,
      lng: -122.0839,
      price: 1450000,
      beds: 3,
      baths: 2.5,
      sqft: 1850,
      lotSqft: 4200,
      hoaMonthly: 0,
      propertyType: 'townhouse',
      yearBuilt: 2015,
      photos: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914'],
      features: ['Open floor plan', 'Updated appliances', 'Two-car garage'],
    },
    {
      address: '789 Pine Court, Sunnyvale, CA 94086',
      lat: 37.3688,
      lng: -122.0363,
      price: 980000,
      beds: 2,
      baths: 2,
      sqft: 1200,
      lotSqft: null,
      hoaMonthly: 450,
      propertyType: 'condo',
      yearBuilt: 2020,
      photos: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'],
      features: ['Pool', 'Gym', 'Concierge', 'Parking included'],
    },
    {
      address: '321 Maple Drive, Menlo Park, CA 94025',
      lat: 37.4530,
      lng: -122.1817,
      price: 3200000,
      beds: 5,
      baths: 4,
      sqft: 3500,
      lotSqft: 8000,
      hoaMonthly: 0,
      propertyType: 'house',
      yearBuilt: 2019,
      photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'],
      features: ['Chef kitchen', 'Home office', 'Pool', 'Smart home', 'Guest suite'],
    },
    {
      address: '654 Cedar Lane, Redwood City, CA 94061',
      lat: 37.4852,
      lng: -122.2364,
      price: 1750000,
      beds: 3,
      baths: 2,
      sqft: 1650,
      lotSqft: 5000,
      hoaMonthly: 0,
      propertyType: 'house',
      yearBuilt: 2010,
      photos: ['https://images.unsplash.com/photo-1605146769289-440113cc3d00'],
      features: ['Remodeled', 'Deck', 'Mature trees', 'Close to transit'],
    },
    {
      address: '987 Birch Street, San Jose, CA 95110',
      lat: 37.3382,
      lng: -121.8863,
      price: 1200000,
      beds: 4,
      baths: 3,
      sqft: 2200,
      lotSqft: 5500,
      hoaMonthly: 0,
      propertyType: 'house',
      yearBuilt: 2005,
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
      features: ['Updated kitchen', 'Large yard', 'Quiet neighborhood'],
    },
  ];

  for (const listing of listings) {
    await prisma.listing.create({
      data: listing,
    });
  }

  console.log(`Created ${listings.length} sample listings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
