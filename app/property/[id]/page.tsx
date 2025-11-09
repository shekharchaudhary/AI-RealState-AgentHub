import { notFound } from 'next/navigation';
import Link from 'next/link';
import PhotoGallery from '@/components/PhotoGallery';

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

async function getProperty(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/property/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.property;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900'>
      {/* Navigation */}
      <nav className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg' />
              <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                RealStateAgent.AI
              </span>
            </Link>
            <div className='flex items-center space-x-4'>
              <Link
                href='/search'
                className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                Back to Search
              </Link>
              <Link
                href='/dashboard'
                className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300'
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className='flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Photo Gallery */}
        <div className='mb-8'>
          <PhotoGallery
            photos={property.photos || []}
            address={property.address}
          />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Property Details */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Price and Address */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h1 className='text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                    {formatPrice(property.price)}
                  </h1>
                  <p className='text-xl text-gray-700 dark:text-gray-300'>
                    {property.address}
                  </p>
                  {property.mlsId && (
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      MLS #: {property.mlsId}
                    </p>
                  )}
                </div>
                <span className='px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-semibold capitalize'>
                  {property.propertyType}
                </span>
              </div>

              {/* Key Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                <div className='text-center'>
                  <div className='flex items-center justify-center mb-2'>
                    <svg
                      className='w-6 h-6 text-blue-600 dark:text-blue-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                      />
                    </svg>
                  </div>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {property.beds}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Bedrooms
                  </p>
                </div>
                <div className='text-center'>
                  <div className='flex items-center justify-center mb-2'>
                    <svg
                      className='w-6 h-6 text-blue-600 dark:text-blue-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z'
                      />
                    </svg>
                  </div>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {property.baths}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Bathrooms
                  </p>
                </div>
                {property.sqft && (
                  <div className='text-center'>
                    <div className='flex items-center justify-center mb-2'>
                      <svg
                        className='w-6 h-6 text-blue-600 dark:text-blue-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5'
                        />
                      </svg>
                    </div>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {formatNumber(property.sqft)}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Sq Ft
                    </p>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className='text-center'>
                    <div className='flex items-center justify-center mb-2'>
                      <svg
                        className='w-6 h-6 text-blue-600 dark:text-blue-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                    </div>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {property.yearBuilt}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Year Built
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Property Details
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {property.lotSqft && (
                  <div className='flex justify-between py-2 border-b border-gray-200 dark:border-gray-700'>
                    <span className='text-gray-600 dark:text-gray-400'>
                      Lot Size
                    </span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {formatNumber(property.lotSqft)} sq ft
                    </span>
                  </div>
                )}
                {property.hoaMonthly && (
                  <div className='flex justify-between py-2 border-b border-gray-200 dark:border-gray-700'>
                    <span className='text-gray-600 dark:text-gray-400'>
                      HOA Monthly
                    </span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {formatPrice(property.hoaMonthly)}
                    </span>
                  </div>
                )}
                {property.lat && property.lng && (
                  <div className='flex justify-between py-2 border-b border-gray-200 dark:border-gray-700'>
                    <span className='text-gray-600 dark:text-gray-400'>
                      Coordinates
                    </span>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {property.lat.toFixed(4)}, {property.lng.toFixed(4)}
                    </span>
                  </div>
                )}
                <div className='flex justify-between py-2 border-b border-gray-200 dark:border-gray-700'>
                  <span className='text-gray-600 dark:text-gray-400'>
                    Property Type
                  </span>
                  <span className='font-semibold text-gray-900 dark:text-white capitalize'>
                    {property.propertyType}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                  Property Features
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {property.features.map((feature: string, index: number) => (
                    <div key={index} className='flex items-center space-x-2'>
                      <svg
                        className='w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      <span className='text-gray-700 dark:text-gray-300'>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Call to Action */}
          <div className='lg:col-span-1'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                Interested in this property?
              </h2>

              <div className='space-y-4'>
                <button className='w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                  Schedule a Tour
                </button>

                <button className='w-full px-6 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-blue-600 dark:border-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-300'>
                  Make an Offer
                </button>

                <button className='w-full px-6 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300'>
                  Save to Favorites
                </button>

                <button className='w-full px-6 py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300'>
                  Contact Agent
                </button>
              </div>

              <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
                <p className='text-sm text-gray-600 dark:text-gray-400 text-center'>
                  Features coming in Phase 3-5
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='mt-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <p className='text-center text-gray-600 dark:text-gray-400'>
            &copy; 2025 RealStateAgent.AI. Your AI Real Estate Assistant.
          </p>
        </div>
      </footer>
    </div>
  );
}
