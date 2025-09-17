// app/api/auth/admin-login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import connectToDatabase from "@/lib/connect";
import adminModel from "@/db/models/Admin";
import { encrypt } from "@/lib/auth"; // renamed to session.ts earlier

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const data = await request.formData();
    const email = data.get("email") as string | null;
    const password = data.get("password") as string | null;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await adminModel.findOne({ $or: [{ email }, { name: email }] });
    if (!user) {
      return NextResponse.json({ error: "Invalid email" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const tokenPayload = { username: user.name, email: user.email, role: user.role };
    const token = await encrypt(tokenPayload);

    // Create response
    const response = NextResponse.json({ message: "Login Successfully" }, { status: 200 });

    // Set cookie on response
    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 2, // 2 days
    });

    return response;
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json({ message: "Failed to login" }, { status: 500 });
  }
}