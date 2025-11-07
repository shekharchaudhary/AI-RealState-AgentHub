'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import MapView from '@/components/MapView';
import SearchChat from '@/components/SearchChat';

interface SearchFilters {
  location?: string;
  priceMin: string;
  priceMax: string;
  beds: string;
  baths: string;
  propertyType: string;
}

interface Listing {
  id: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  photos: string[];
  propertyType: string;
}

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    priceMin: '',
    priceMax: '',
    beds: '',
    baths: '',
    propertyType: 'all',
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [mapCenter, setMapCenter] = useState<
    { lat: number; lng: number } | undefined
  >({ lat: 40.7128, lng: -73.9352 }); // Default to New York City
  const [mapZoom, setMapZoom] = useState(10);
  const [showChat, setShowChat] = useState(false);
  const [searchCoords, setSearchCoords] = useState<
    { lat: number; lng: number } | undefined
  >({ lat: 40.7128, lng: -73.9352 }); // Default to NYC for proximity sorting

  const handleSearch = async (
    customFilters?: Partial<SearchFilters>,
    coords?: { lat: number; lng: number }
  ) => {
    setLoading(true);
    setSearched(true);
    const searchFilters = customFilters
      ? { ...filters, ...customFilters }
      : filters;

    // Include search coordinates for proximity sorting
    const searchPayload: any = { ...searchFilters };
    if (coords) {
      // Explicit coordinates provided (from AI chat)
      searchPayload.searchLat = coords.lat;
      searchPayload.searchLng = coords.lng;
    } else if (!searchFilters.location || searchFilters.location.trim() === '') {
      // No location filter, use default NYC coordinates for proximity sorting
      searchPayload.searchLat = searchCoords?.lat;
      searchPayload.searchLng = searchCoords?.lng;
    }
    // If location is provided but no coords, don't include coordinates
    // This allows location-based filtering without proximity sorting bias

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchPayload),
      });
      const data = await response.json();
      const results = data.results || [];
      setListings(results);

      // Auto-center map on search results if we have properties and no explicit coords were provided
      if (results.length > 0 && !coords) {
        const avgLat = results.reduce((sum: number, p: any) => sum + p.lat, 0) / results.length;
        const avgLng = results.reduce((sum: number, p: any) => sum + p.lng, 0) / results.length;
        const newCenter = { lat: avgLat, lng: avgLng };
        setMapCenter(newCenter);
        setSearchCoords(newCenter);

        // Adjust zoom based on spread of properties
        const latSpread = Math.max(...results.map((p: any) => p.lat)) - Math.min(...results.map((p: any) => p.lat));
        const lngSpread = Math.max(...results.map((p: any) => p.lng)) - Math.min(...results.map((p: any) => p.lng));
        const maxSpread = Math.max(latSpread, lngSpread);

        // Calculate appropriate zoom level
        let newZoom = 13; // default
        if (maxSpread > 5) newZoom = 8;  // Very spread out (multiple states)
        else if (maxSpread > 2) newZoom = 9;  // Large metro area
        else if (maxSpread > 1) newZoom = 10; // Metro area
        else if (maxSpread > 0.5) newZoom = 11; // City
        else if (maxSpread > 0.2) newZoom = 12; // District
        else newZoom = 13; // Neighborhood

        setMapZoom(newZoom);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSearchUpdate = (chatFilters: any) => {
    const updatedFilters: Partial<SearchFilters> = {
      location: chatFilters.location || filters.location,
      priceMin: chatFilters.priceMin?.toString() || filters.priceMin,
      priceMax: chatFilters.priceMax?.toString() || filters.priceMax,
      beds: chatFilters.beds?.toString() || filters.beds,
      baths: chatFilters.baths?.toString() || filters.baths,
      propertyType: chatFilters.propertyType || filters.propertyType,
    };

    setFilters({ ...filters, ...updatedFilters });

    // Update map center and zoom if provided
    if (chatFilters.mapCenter) {
      setMapCenter(chatFilters.mapCenter);
      setSearchCoords(chatFilters.mapCenter); // Store for proximity sorting
    }
    if (chatFilters.mapZoom) {
      setMapZoom(chatFilters.mapZoom);
    }

    // Trigger search with updated filters and coordinates
    handleSearch(updatedFilters, chatFilters.mapCenter);
  };

  useEffect(() => {
    // Initial search with NYC coordinates to show nearby properties
    handleSearch({}, { lat: 40.7128, lng: -73.9352 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950'>
      {/* Navigation */}
      <nav className='border-b border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm sticky top-0 z-30'>
        <div className='max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16 items-center'>
            <Link href='/' className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg'></div>
              <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                realStateAgent.ai
              </span>
            </Link>
            <div className='flex gap-4 items-center'>
              {/* View Mode Toggle */}
              <div className='hidden md:flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'split'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Split View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Map
                </button>
              </div>

              <button
                onClick={() => setShowChat(!showChat)}
                className='relative px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-200 font-medium'
              >
                <span className='flex items-center gap-2'>
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
                      d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                    />
                  </svg>
                  AI Chat
                </span>
              </button>

              <Link
                href='/dashboard'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium'
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='mb-6'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3'>
            Find Your Dream Home
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Explore {listings.length} properties that match your needs
          </p>
        </div>

        {/* Filters */}
        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6'>
          <div className='grid md:grid-cols-2 lg:grid-cols-7 gap-4'>
            <div className='lg:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Location / City
              </label>
              <input
                type='text'
                placeholder='e.g., New York, San Francisco'
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Min Price
              </label>
              <input
                type='number'
                placeholder='$0'
                value={filters.priceMin}
                onChange={(e) =>
                  setFilters({ ...filters, priceMin: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Max Price
              </label>
              <input
                type='number'
                placeholder='$5,000,000'
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters({ ...filters, priceMax: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Beds
              </label>
              <select
                value={filters.beds}
                onChange={(e) =>
                  setFilters({ ...filters, beds: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
              >
                <option value=''>Any</option>
                <option value='1'>1+</option>
                <option value='2'>2+</option>
                <option value='3'>3+</option>
                <option value='4'>4+</option>
                <option value='5'>5+</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Baths
              </label>
              <select
                value={filters.baths}
                onChange={(e) =>
                  setFilters({ ...filters, baths: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
              >
                <option value=''>Any</option>
                <option value='1'>1+</option>
                <option value='1.5'>1.5+</option>
                <option value='2'>2+</option>
                <option value='2.5'>2.5+</option>
                <option value='3'>3+</option>
                <option value='4'>4+</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) =>
                  setFilters({ ...filters, propertyType: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
              >
                <option value='all'>All Types</option>
                <option value='house'>House</option>
                <option value='condo'>Condo</option>
                <option value='townhouse'>Townhouse</option>
                <option value='land'>Land</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className='mt-4 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          >
            {loading ? 'Searching...' : 'Search Properties'}
          </button>
        </div>

        {/* Main Content Area */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* Results and/or Map */}
          <div
            className={
              showChat ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'
            }
          >
            <div
              className={`grid gap-6 ${
                viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {/* List View - Now appears FIRST (left side) */}
              {(viewMode === 'split' || viewMode === 'list') && (
                <div className={viewMode === 'list' ? 'col-span-1' : ''}>
                  {loading ? (
                    <div className='text-center py-20'>
                      <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600'></div>
                      <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Searching properties...
                      </p>
                    </div>
                  ) : listings.length > 0 ? (
                    <div
                      className={`grid gap-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 ${
                        viewMode === 'list'
                          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                          : 'grid-cols-1 xl:grid-cols-2'
                      }`}
                    >
                      {listings.map((listing) => (
                        <PropertyCard key={listing.id} {...listing} />
                      ))}
                    </div>
                  ) : searched ? (
                    <div className='text-center py-20'>
                      <div className='text-gray-500 dark:text-gray-400 mb-4'>
                        <svg
                          className='w-20 h-20 mx-auto mb-6 text-gray-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1.5}
                            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                          />
                        </svg>
                        <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                          No properties found
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400'>
                          Try adjusting your filters or ask the AI assistant
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Map View - Now appears SECOND (right side) */}
              {(viewMode === 'split' || viewMode === 'map') && (
                <div className={viewMode === 'map' ? 'col-span-1' : ''}>
                  <div className='sticky top-24 h-[calc(100vh-8rem)]'>
                    {loading ? (
                      <div className='w-full h-full bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center'>
                        <div className='text-center'>
                          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 mb-4'></div>
                          <p className='text-gray-600 dark:text-gray-400'>
                            Loading map...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <MapView
                        properties={listings}
                        center={mapCenter}
                        zoom={mapZoom}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Sidebar (Collapsible) - Now on RIGHT side */}
          {showChat && (
            <div className='lg:col-span-4 xl:col-span-3'>
              <div className='sticky top-24 h-[calc(100vh-8rem)]'>
                <SearchChat onSearchUpdate={handleChatSearchUpdate} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
