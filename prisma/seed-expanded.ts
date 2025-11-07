import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Bay Area cities with coordinates
const cities = [
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, count: 40 },
  { name: 'Oakland', lat: 37.8044, lng: -122.2712, count: 30 },
  { name: 'Berkeley', lat: 37.8715, lng: -122.2730, count: 25 },
  { name: 'Palo Alto', lat: 37.4419, lng: -122.1430, count: 30 },
  { name: 'Mountain View', lat: 37.3861, lng: -122.0839, count: 25 },
  { name: 'Sunnyvale', lat: 37.3688, lng: -122.0363, count: 25 },
  { name: 'San Jose', lat: 37.3382, lng: -121.8863, count: 40 },
  { name: 'Menlo Park', lat: 37.4530, lng: -122.1817, count: 20 },
  { name: 'Redwood City', lat: 37.4852, lng: -122.2364, count: 20 },
  { name: 'Cupertino', lat: 37.3230, lng: -122.0322, count: 20 },
  { name: 'Santa Clara', lat: 37.3541, lng: -121.9552, count: 15 },
  { name: 'Fremont', lat: 37.5485, lng: -121.9886, count: 15 },
  { name: 'Milpitas', lat: 37.4323, lng: -121.8996, count: 15 },
  { name: 'San Mateo', lat: 37.5630, lng: -122.3255, count: 20 },
  { name: 'Hayward', lat: 37.6688, lng: -122.0808, count: 15 },
  { name: 'Pleasanton', lat: 37.6624, lng: -121.8747, count: 15 },
  { name: 'Livermore', lat: 37.6819, lng: -121.7681, count: 12 },
  { name: 'Alameda', lat: 37.7652, lng: -122.2416, count: 12 },
];

const propertyTypes = ['house', 'condo', 'townhouse', 'land'];

const streets = [
  'Main Street', 'Oak Avenue', 'Maple Drive', 'Park Place', 'Cedar Lane',
  'Elm Street', 'Pine Avenue', 'Willow Court', 'Birch Way', 'Spruce Drive',
  'Walnut Street', 'Cherry Lane', 'Aspen Court', 'Redwood Avenue', 'Palm Drive',
  'Vista Way', 'Canyon Road', 'Hill Street', 'Valley Drive', 'Ridge Road',
  'Bay Street', 'Ocean Avenue', 'River Road', 'Lake Drive', 'Forest Lane',
  'Meadow Court', 'Garden Way', 'Sunset Boulevard', 'Sunrise Drive', 'Skyline Road',
];

const features = [
  ['Modern kitchen', 'Hardwood floors', 'Updated bathrooms', 'Central AC'],
  ['Granite countertops', 'Stainless appliances', 'Walk-in closets', 'Fireplace'],
  ['Open floor plan', 'Large backyard', 'Garden', 'Patio'],
  ['Garage', 'Driveway', 'Storage space', 'Laundry room'],
  ['Pool', 'Spa', 'Outdoor kitchen', 'BBQ area'],
  ['Smart home features', 'Solar panels', 'Energy efficient', 'Double pane windows'],
  ['Deck', 'Balcony', 'Rooftop access', 'City views'],
  ['Renovated', 'Move-in ready', 'New construction', 'Designer finishes'],
  ['Quiet neighborhood', 'Near schools', 'Near parks', 'Near transit'],
  ['High ceilings', 'Large windows', 'Natural light', 'Built-in storage'],
];

const photos = [
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
  'https://images.unsplash.com/photo-1600210492493-0946911123ea',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
];

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateListing(city: typeof cities[0], index: number) {
  const propertyType = randomFromArray(propertyTypes);
  const beds = propertyType === 'land' ? 0 : randomInt(1, 5);
  const baths = propertyType === 'land' ? 0 : randomInt(1, beds + 1) + (Math.random() > 0.5 ? 0.5 : 0);

  // Price varies by city and property type
  const basePrices: Record<string, number> = {
    'San Francisco': 1800000,
    'Palo Alto': 2500000,
    'Menlo Park': 2300000,
    'Mountain View': 1900000,
    'Cupertino': 2100000,
    'San Jose': 1500000,
    'Sunnyvale': 1700000,
    'Santa Clara': 1600000,
    'Redwood City': 1800000,
    'San Mateo': 1900000,
    'Oakland': 1200000,
    'Berkeley': 1400000,
    'Fremont': 1300000,
    'Hayward': 900000,
    'Milpitas': 1400000,
    'Pleasanton': 1500000,
    'Livermore': 1100000,
    'Alameda': 1200000,
  };

  const basePrice = basePrices[city.name] || 1000000;
  const typeMultiplier = {
    house: 1.2,
    condo: 0.7,
    townhouse: 0.9,
    land: 0.5,
  }[propertyType];

  const price = Math.round((basePrice + randomInt(-300000, 500000)) * typeMultiplier / 50000) * 50000;

  const sqft = propertyType === 'land' ? null : randomInt(800, 4000);
  const lotSqft = propertyType === 'condo' ? null : randomInt(2000, 10000);
  const hoaMonthly = propertyType === 'condo' || propertyType === 'townhouse' ? randomInt(200, 800) : randomInt(0, 200);

  // Add some variation to coordinates
  const latVariation = (Math.random() - 0.5) * 0.1;
  const lngVariation = (Math.random() - 0.5) * 0.1;

  const streetNumber = randomInt(100, 9999);
  const streetName = randomFromArray(streets);
  const aptNumber = propertyType === 'condo' ? ` #${randomInt(101, 999)}` : '';
  const address = `${streetNumber} ${streetName}${aptNumber}, ${city.name}, CA ${randomInt(94000, 95000)}`;

  return {
    address,
    lat: city.lat + latVariation,
    lng: city.lng + lngVariation,
    price,
    beds,
    baths,
    sqft,
    lotSqft,
    hoaMonthly,
    propertyType,
    yearBuilt: propertyType === 'land' ? null : randomInt(1950, 2024),
    photos: Array.from({ length: randomInt(3, 6) }, () => randomFromArray(photos)),
    features: [
      ...randomFromArray(features),
      ...randomFromArray(features),
    ].slice(0, randomInt(4, 8)),
  };
}

async function main() {
  console.log('Seeding database with 300+ Bay Area properties...');

  // Clear existing data in correct order (foreign key constraints)
  console.log('Clearing existing data...');
  await prisma.escrow.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.listing.deleteMany();
  console.log('Existing data cleared.');

  const allListings = [];

  for (const city of cities) {
    console.log(`Generating ${city.count} properties for ${city.name}...`);
    for (let i = 0; i < city.count; i++) {
      allListings.push(generateListing(city, i));
    }
  }

  console.log(`Creating ${allListings.length} total listings...`);

  // Insert in batches for better performance
  const batchSize = 50;
  for (let i = 0; i < allListings.length; i += batchSize) {
    const batch = allListings.slice(i, i + batchSize);
    await prisma.listing.createMany({
      data: batch,
    });
    console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allListings.length / batchSize)}`);
  }

  const count = await prisma.listing.count();
  console.log(`✅ Successfully seeded ${count} properties across ${cities.length} Bay Area cities!`);

  // Show distribution
  console.log('\nProperty distribution:');
  for (const city of cities) {
    const cityCount = await prisma.listing.count({
      where: { address: { contains: city.name } },
    });
    console.log(`  ${city.name}: ${cityCount} properties`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
