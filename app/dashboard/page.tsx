'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Listing {
  id: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  photos: string[];
  propertyType: string;
}

interface Favorite {
  id: string;
  notes?: string;
  createdAt: string;
  listing: Listing;
}

interface Tour {
  id: string;
  start: string;
  end: string;
  status: string;
  createdAt: string;
  listing: Listing;
}

interface Offer {
  id: string;
  price: number;
  status: string;
  createdAt: string;
  listing: Listing;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
  };
  stats: {
    savedProperties: number;
    scheduledTours: number;
    activeOffers: number;
  };
  favorites: Favorite[];
  tours: Tour[];
  offers: Offer[];
  recentActivity: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400 text-lg'>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950'>
      {/* Navigation */}
      <nav className='border-b border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm sticky top-0 z-30'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16 items-center'>
            <Link href='/' className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg'></div>
              <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                RealStateAgent.AI
              </span>
            </Link>
            <div className='flex gap-4 items-center'>
              <Link
                href='/search'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium'
              >
                Search
              </Link>
              <div className='flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full'>
                <div className='w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                  {data?.user?.name?.charAt(0) || 'D'}
                </div>
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  {data?.user?.name || 'Demo User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2'>
            Welcome back, {data?.user?.name || 'there'}! 👋
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Here&apos;s your activity overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <div className='group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Saved Properties
              </h3>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
              </div>
            </div>
            <p className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent'>
              {data?.stats?.savedProperties || 0}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              {data?.stats?.savedProperties
                ? 'properties you love'
                : 'No saved properties yet'}
            </p>
          </div>

          <div className='group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Scheduled Tours
              </h3>
              <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform'>
                <svg
                  className='w-6 h-6 text-white'
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
            </div>
            <p className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent'>
              {data?.stats?.scheduledTours || 0}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              {data?.stats?.scheduledTours
                ? 'upcoming visits'
                : 'No tours scheduled'}
            </p>
          </div>

          <div className='group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Active Offers
              </h3>
              <div className='w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
            </div>
            <p className='text-4xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent'>
              {data?.stats?.activeOffers || 0}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              {data?.stats?.activeOffers ? 'in progress' : 'No active offers'}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Left Column - Saved Properties & Tours */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Saved Properties */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Saved Properties
                </h2>
                <Link
                  href='/search'
                  className='text-blue-600 hover:text-blue-700 text-sm font-medium'
                >
                  View All →
                </Link>
              </div>
              {data?.favorites && data.favorites.length > 0 ? (
                <div className='grid md:grid-cols-2 gap-4'>
                  {data.favorites.slice(0, 4).map((favorite) => (
                    <Link
                      key={favorite.id}
                      href={`/property/${favorite.listing.id}`}
                      className='group bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-1'
                    >
                      <div className='relative h-40'>
                        <Image
                          src={favorite.listing.photos[0] || '/placeholder.jpg'}
                          alt={favorite.listing.address}
                          fill
                          className='object-cover'
                        />
                        <div className='absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full'>
                          <svg
                            className='w-4 h-4'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </div>
                      </div>
                      <div className='p-4'>
                        <p className='text-lg font-bold text-gray-900 dark:text-white mb-1'>
                          ${favorite.listing.price.toLocaleString()}
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                          {favorite.listing.beds} bd · {favorite.listing.baths}{' '}
                          ba
                          {favorite.listing.sqft &&
                            ` · ${favorite.listing.sqft.toLocaleString()} sqft`}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-500 line-clamp-1'>
                          {favorite.listing.address}
                        </p>
                        {favorite.notes && (
                          <p className='text-xs text-blue-600 dark:text-blue-400 mt-2 italic'>
                            Note: {favorite.notes}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className='text-center py-12'>
                  <svg
                    className='w-16 h-16 mx-auto text-gray-400 mb-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                  <p className='text-gray-600 dark:text-gray-400'>
                    No saved properties yet
                  </p>
                  <Link
                    href='/search'
                    className='text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block'
                  >
                    Start searching →
                  </Link>
                </div>
              )}
            </div>

            {/* Scheduled Tours */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                Upcoming Tours
              </h2>
              {data?.tours && data.tours.length > 0 ? (
                <div className='space-y-4'>
                  {data.tours.map((tour) => {
                    const tourDate = new Date(tour.start);
                    const isConfirmed = tour.status === 'confirmed';
                    return (
                      <div
                        key={tour.id}
                        className='flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all'
                      >
                        <div className='flex-shrink-0'>
                          <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex flex-col items-center justify-center'>
                            <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                              {tourDate.getDate()}
                            </p>
                            <p className='text-xs text-purple-600 dark:text-purple-400'>
                              {tourDate.toLocaleDateString('en-US', {
                                month: 'short',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <Link
                            href={`/property/${tour.listing.id}`}
                            className='font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-1'
                          >
                            {tour.listing.address}
                          </Link>
                          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                            {tourDate.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                          <span
                            className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                              isConfirmed
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {tour.status.charAt(0).toUpperCase() +
                              tour.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='text-center py-12'>
                  <svg
                    className='w-16 h-16 mx-auto text-gray-400 mb-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                  <p className='text-gray-600 dark:text-gray-400'>
                    No tours scheduled
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Active Offers & Quick Actions */}
          <div className='space-y-6'>
            {/* Active Offers */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                Active Offers
              </h2>
              {data?.offers && data.offers.length > 0 ? (
                <div className='space-y-4'>
                  {data.offers.map((offer) => {
                    const statusColors: Record<string, string> = {
                      draft:
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                      pending:
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                      accepted:
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                      countered:
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                      rejected:
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                    };

                    return (
                      <div
                        key={offer.id}
                        className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all'
                      >
                        <Link
                          href={`/property/${offer.listing.id}`}
                          className='font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-2 text-sm'
                        >
                          {offer.listing.address}
                        </Link>
                        <p className='text-lg font-bold text-gray-900 dark:text-white mt-2'>
                          ${offer.price.toLocaleString()}
                        </p>
                        <span
                          className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                            statusColors[offer.status] || statusColors.draft
                          }`}
                        >
                          {offer.status.charAt(0).toUpperCase() +
                            offer.status.slice(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='text-center py-12'>
                  <svg
                    className='w-16 h-16 mx-auto text-gray-400 mb-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>
                    No active offers
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                Quick Actions
              </h2>
              <div className='space-y-3'>
                <Link
                  href='/search'
                  className='flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                  <span className='font-semibold'>Search Properties</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
