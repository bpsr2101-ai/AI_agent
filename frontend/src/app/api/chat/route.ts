import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { question, session_id } = await req.json();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  try {
    const backendRes = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      // credentials: 'include', // Not needed for server-to-server
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (e) {
    return NextResponse.json({ error: 'Backend error' }, { status: 500 });
  }
} 