import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/connect';
import AdminModel from '@/db/models/Admin';
import mongoose from 'mongoose';

interface RouteParams {
  params: {
    name: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    // Extract name from dynamic route
    const { name } = params;

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
