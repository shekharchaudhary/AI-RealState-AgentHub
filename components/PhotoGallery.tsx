'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PhotoGalleryProps {
  photos: string[];
  address: string;
}

export default function PhotoGallery({ photos, address }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Fallback if no photos
  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
        <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextPhoto = () => {
    setSelectedPhoto((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setSelectedPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
        {/* Main large photo */}
        <div
          className="col-span-4 md:col-span-2 row-span-2 cursor-pointer relative h-96 md:h-full bg-gray-200 dark:bg-gray-700 overflow-hidden group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={photos[0]}
            alt={`${address} - Main photo`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <svg className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>

        {/* Additional photos in grid */}
        {photos.slice(1, 5).map((photo, index) => (
          <div
            key={index + 1}
            className="col-span-2 md:col-span-1 cursor-pointer relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden group"
            onClick={() => openLightbox(index + 1)}
          >
            <img
              src={photo}
              alt={`${address} - Photo ${index + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            {index === 3 && photos.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">+{photos.length - 5} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={closeLightbox}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="max-w-6xl max-h-[90vh] w-full px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[selectedPhoto]}
              alt={`${address} - Photo ${selectedPhoto + 1}`}
              className="w-full h-full object-contain"
            />
            <div className="text-center text-white mt-4">
              {selectedPhoto + 1} / {photos.length}
            </div>
          </div>

          <button
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
