import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        <div className='text-center mb-8'>
          <Link href='/' className='inline-flex items-center gap-2 mb-4'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl'></div>
            <span className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              RealStateAgent.AI
            </span>
          </Link>
          <p className='mt-4 text-lg text-gray-600 dark:text-gray-400'>
            Sign in to your account
          </p>
        </div>

        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8'>
          <div className='text-center mb-6'>
            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            </div>
            <p className='text-gray-600 dark:text-gray-400 mb-2'>
              Authentication will be implemented in Phase 3
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-500'>
              For now, explore the demo
            </p>
          </div>
          <Link
            href='/dashboard'
            className='w-full block text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold'
          >
            Continue to Dashboard
          </Link>
        </div>

        <p className='text-center mt-6 text-gray-600 dark:text-gray-400'>
          Don&apos;t have an account?{' '}
          <Link
            href='/signup'
            className='font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:underline'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
