import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // In a real app, you would verify credentials against a database
    // For now, just return a mock user
    const user = {
      id: '1',
      email,
      name: email.split('@')[0]
    }
    
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 400 })
  }
}