import Link from 'next/link';

interface PropertyCardProps {
  id: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  photos: string[];
  propertyType: string;
}

export default function PropertyCard({
  id,
  address,
  price,
  beds,
  baths,
  sqft,
  photos,
  propertyType,
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/property/${id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {photos && photos[0] ? (
            <img
              src={photos[0]}
              alt={address}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-semibold text-gray-900 dark:text-white rounded-full capitalize">
              {propertyType}
            </span>
          </div>
        </div>

        <div className="p-3">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
              {formatPrice(price)}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-1">
              {address}
            </p>
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-medium">{beds} bd</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
              </svg>
              <span className="text-xs font-medium">{baths} ba</span>
            </div>
            {sqft && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span className="text-xs font-medium">{sqft.toLocaleString()} sf</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
