'use client';

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from '@vis.gl/react-google-maps';
import { useState } from 'react';
import Link from 'next/link';

interface Property {
  id: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  propertyType: string;
  photos: string[];
}

interface MapViewProps {
  properties: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function MapView({
  properties,
  center,
  zoom = 11,
}: MapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  // Calculate center if not provided
  const mapCenter =
    center ||
    (properties.length > 0
      ? {
          lat:
            properties.reduce((sum, p) => sum + p.lat, 0) / properties.length,
          lng:
            properties.reduce((sum, p) => sum + p.lng, 0) / properties.length,
        }
      : { lat: 37.4419, lng: -122.143 }); // Default to Palo Alto

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return (
      <div className='w-full h-full bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center p-8'>
        <div className='text-center'>
          <svg
            className='w-16 h-16 text-gray-400 mx-auto mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
            />
          </svg>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
            Google Maps API Key Required
          </h3>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>
            Please add your NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to the .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className='w-full h-full rounded-2xl overflow-hidden'>
        <Map
          mapId='nestora-map'
          defaultCenter={mapCenter}
          defaultZoom={zoom}
          gestureHandling='greedy'
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
        >
          {properties.map((property) => (
            <AdvancedMarker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              onClick={() => setSelectedProperty(property)}
            >
              <Pin
                background={
                  selectedProperty?.id === property.id ? '#9333ea' : '#2563eb'
                }
                borderColor={
                  selectedProperty?.id === property.id ? '#7c3aed' : '#1d4ed8'
                }
                glyphColor='#ffffff'
                scale={selectedProperty?.id === property.id ? 1.2 : 1}
              />
            </AdvancedMarker>
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{
                lat: selectedProperty.lat,
                lng: selectedProperty.lng,
              }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className='p-2 max-w-xs'>
                <Link href={`/property/${selectedProperty.id}`}>
                  {selectedProperty.photos && selectedProperty.photos[0] && (
                    <img
                      src={selectedProperty.photos[0]}
                      alt={selectedProperty.address}
                      className='w-full h-32 object-cover rounded-lg mb-2'
                    />
                  )}
                  <h3 className='font-bold text-blue-600 text-lg mb-1'>
                    {formatPrice(selectedProperty.price)}
                  </h3>
                  <p className='text-sm text-gray-700 mb-2 line-clamp-2'>
                    {selectedProperty.address}
                  </p>
                  <div className='flex items-center gap-3 text-xs text-gray-600'>
                    <span>{selectedProperty.beds} bed</span>
                    <span>{selectedProperty.baths} bath</span>
                    {selectedProperty.sqft && (
                      <span>{selectedProperty.sqft.toLocaleString()} sqft</span>
                    )}
                  </div>
                  <div className='mt-2 text-xs text-blue-600 hover:text-blue-800'>
                    View Details →
                  </div>
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
