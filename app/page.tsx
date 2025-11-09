'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950'>
      <nav className='border-b border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md fixed w-full z-10 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16 items-center'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg'></div>
              <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                RealStateAgent.AI
              </span>
            </div>
            <div className='flex gap-4 items-center'>
              <Link
                href='/search'
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium'
              >
                Search
              </Link>
              <button
                onClick={toggleTheme}
                className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                  </svg>
                ) : (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                )}
              </button>
              <Link
                href='/signin'
                className='px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium'
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className='flex-1 pt-16'>
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32'>
          <div className='text-center'>
            <div className='inline-block mb-6'>
              <span className='px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium'>
                AI-Powered Real Estate
              </span>
            </div>
            <h1 className='text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight'>
              Your AI Real Estate
              <span className='block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2'>
                Assistant
              </span>
            </h1>
            <p className='text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed'>
              Discover your dream home with intelligent search, automated tour
              scheduling, and expert offer assistance—available 24/7
            </p>
            <div className='flex gap-4 justify-center flex-wrap'>
              <Link
                href='/search'
                className='group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-200 text-lg font-semibold flex items-center gap-2'
              >
                Start Searching
                <svg
                  className='w-5 h-5 group-hover:translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                  />
                </svg>
              </Link>
              <Link
                href='#features'
                className='px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:border-blue-600 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-lg font-semibold'
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section
          id='features'
          className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'
        >
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
              Everything You Need
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              Streamlined tools to make your home buying journey effortless
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-1'>
              <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <svg
                  className='w-7 h-7 text-white'
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
              </div>
              <h3 className='text-2xl font-bold mb-3 text-gray-900 dark:text-white'>
                Smart Search
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                Find homes that match your preferences with AI-powered semantic
                search and neighborhood insights
              </p>
            </div>

            <div className='group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:-translate-y-1'>
              <div className='w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <svg
                  className='w-7 h-7 text-white'
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
              <h3 className='text-2xl font-bold mb-3 text-gray-900 dark:text-white'>
                Easy Scheduling
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                Book tours instantly with automated calendar coordination and
                SMS reminders
              </p>
            </div>

            <div className='group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 hover:-translate-y-1'>
              <div className='w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <svg
                  className='w-7 h-7 text-white'
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
              <h3 className='text-2xl font-bold mb-3 text-gray-900 dark:text-white'>
                Offer Assistance
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                Get market analysis, draft offers with templates, and e-sign
                documents seamlessly
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t border-gray-200 dark:border-gray-700 mt-20 py-12 bg-white dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <div className='w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg'></div>
              <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                RealStateAgent.AI
              </span>
            </div>
            <p className='text-gray-600 dark:text-gray-400'>
              © 2025 RealStateAgent.AI. AI-powered real estate assistant. Not a
              licensed brokerage.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
