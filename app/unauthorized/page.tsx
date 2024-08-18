import React from 'react'
import Link from 'next/link'
import { TriangleAlert } from 'lucide-react'

const UnauthorizedPage = () => {
  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-red-600'>
          Unauthorized
          <TriangleAlert className='w-8 h-8 text-red-600 mr-2 inline-block gap-2' />
        </h1>
        <p className='mt-4 text-lg text-gray-700'>
          We can't sign you in this time, seems there is a problem with your
          account. Please contact your administrator. Thank you.
        </p>
        <Link
          href='/'
          className='mt-6 inline-block text-blue-500 hover:underline'
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}

export default UnauthorizedPage
