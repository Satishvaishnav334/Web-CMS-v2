// app/api/register/route.ts
'use server';

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import Members from '@/db/models/users';
import connectToDatabase from '@/lib/connect';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const data = await request.formData();
    const name = data.get('name')?.toString() ?? '';
    const email = data.get('email')?.toString() ?? '';
    const password = data.get('password')?.toString() ?? '';

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, Email and Password are required' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Members.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return NextResponse.json({ message: 'Failed to create account' }, { status: 400 });
    }

    const jwtSecret = process.env.JWT_SECRET as jwt.Secret;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    const token = jwt.sign(
      { username: user.name, email: user.email },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRATION ?? '1h' } as SignOptions // default 1h
    );

    // Create the response and set the cookie on the response object
    const response = NextResponse.json({ message: 'Account Created Successfully' }, { status: 201 });

    // Set secure, httpOnly cookie on the response
    response.cookies.set('token', token, {
      httpOnly: true, // if you want JS access on client, set this to false (not recommended)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 2, // seconds (2 days)
    });

    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
  }
}
