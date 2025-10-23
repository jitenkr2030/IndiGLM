import { NextResponse } from 'next/server'

export async function GET() {
  // In a real app, you would verify the session/token here
  // For now, return a mock user or null
  return NextResponse.json(null)
}