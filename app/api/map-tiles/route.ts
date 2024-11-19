import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const z = searchParams.get('z')
  const x = searchParams.get('x')
  const y = searchParams.get('y')

  if (!z || !x || !y) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(
      `https://api.maptiler.com/maps/satellite/256/${z}/${x}/${y}.jpg?key=${process.env.MAPTILER_API_KEY}`,
    )

    const arrayBuffer = await response.arrayBuffer()

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tile' }, { status: 500 })
  }
}
