import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get IP from various headers (works with most deployment platforms)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  const ip = cfConnectingIp || forwarded?.split(',')[0] || realIp || 'unknown';
  
  return NextResponse.json({ ip });
}
