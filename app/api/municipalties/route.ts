import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.MARINDUQUE_API_URL

  if (!url) {
    throw new Error(
      'MARINDUQUE_API_URL is not defined in the environment variables',
    )
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch municipalities')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching municipalities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch municipalities' },
      { status: 500 },
    )
  }
}
