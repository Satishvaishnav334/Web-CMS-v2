'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const links = [
    { label: "Contact", href: "/contact" },
    { label: "Pricing", href: "/pricing" },
  ];

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('name', name);

      const res = await axios.post("/api/auth/member-register", formData);
      toast.success(res.data.message, { closeButton: true });
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { closeButton: true });
      console.error("Error fetching users:", error);
    }
  };
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

  return (
    <div className="flex flex-col h-full text-black">

      <div className="flex md:flex-row flex-col justify-around items-center h-[90vh] w-full mb-15 md:mb-0 lg:gap-10 gap-5">
        <div className="bg-yellow-300 w-full h-full flex justify-center items-center">
          <h1 className="font-bold text-2xl">Branding</h1>
        </div>

        <div className="bg-blue-200 w-[90%] lg:w-[50%] md:h-[75%] md:m-10 m-2 rounded-2xl shadow-2xl shadow-black/50">
          <form onSubmit={handleLogIn} className="lg:p-10 p-5 flex flex-col gap-3 md:mx-5">
            <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

            <label className="text-left font-medium text-gray-900">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-500 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-left font-medium text-gray-900">Email</label>
            <input
              type="email"
              placeholder="Enter Email Address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-500 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-left font-medium text-gray-900">Password</label>
            <input
              type="password"
              placeholder="Enter Your Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-500 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 font-semibold text-white px-3 py-2 mt-3 rounded-lg text-xl"
            >
              Sign Up
            </button>
          </form>

          <p className="w-full flex justify-center md:my-0 sm:py-5 p-3 md:py-0">
            I have an account
            <Link href='/login' className="text-red-500 mx-2 font-bold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
