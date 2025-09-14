import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ msg: 'ok' }, { status: 200 });
}
