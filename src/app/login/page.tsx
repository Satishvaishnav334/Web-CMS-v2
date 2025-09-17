'use client';

import axios from "axios";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

// Define link type
interface NavLink {
  label: string;
  href: string;
}

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

    useEffect(() => {
    const checkSession = () => {
        const token = getCookie("token"); // ✅ check each time
      if (token) {
        router.push("/");
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 3000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await axios.post("/api/auth/member-login", formData);
      toast.success(res.data.message, { closeButton: true });
      router.push("/");
    } catch (error: any) {
      toast.error("Invalid email or password", { closeButton: true });
      console.error("Login error:", error.message);
    }
  };



  return (
    <div className="flex flex-col h-full text-black">

      <div className="flex md:flex-row flex-col justify-around items-center h-[90vh] w-full lg:gap-10 gap-5">
        {/* Branding Section */}
        <div className="bg-yellow-300 w-full h-full flex justify-center items-center">
          <h1 className="font-bold text-2xl">Branding</h1>
        </div>

        {/* Login Form */}
        <div className="bg-blue-200 w-[90%] lg:w-[50%] md:h-[65%] md:m-10 m-2 rounded-2xl shadow-2xl shadow-black/50">
          <form
            onSubmit={handleLogIn}
            className="lg:p-10 p-5 flex flex-col gap-3 md:mx-5"
          >
            <h1 className="text-3xl font-bold mb-6 text-center">Log In</h1>

            <label className="text-left font-medium text-gray-900">
              Username Or Email
            </label>
            <input
              type="text"
              placeholder="Enter Your Email Address OR Username *"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-500 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-left font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Your Password *"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-500 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              className="bg-blue-600 hover:bg-blue-700 mt-3 font-semibold text-white px-3 py-2 rounded-lg text-xl"
              type="submit"
            >
              Login
            </button>
          </form>

          <p className="w-full flex justify-center md:my-0 sm:py-5 p-3 md:py-0">
            I don&apos;t have an account
            <Link href="/register" className="text-red-500 mx-2 font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
