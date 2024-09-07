// app/api/members/route.ts
import { readMembers } from '@/app/dashboard/users/actions'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await readMembers()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
