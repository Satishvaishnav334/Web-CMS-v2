import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/connect';
import AdminModel from '@/db/models/Admin';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string; }>; } 
){
  try {
  const { params } = context; 
  const { name } = await params; 
    await connectToDatabase();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing name parameter' }, { status: 400 });
    }

    const data = await AdminModel.findOne({ name }).lean<Record<string, any> | null>();

    if (!data) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
