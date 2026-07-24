// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Use /api/auth/login, /api/auth/logout, or /api/auth/register' },
    { status: 200 }
  )
}
