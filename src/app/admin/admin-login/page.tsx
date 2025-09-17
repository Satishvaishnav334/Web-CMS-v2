'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner'

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const res = await axios.post("/api/auth/admin-login", formData)
      toast.success(res.data.message, { closeButton: true })
      router.push(`/admin/dashboard`)
    } catch (error: any) {
      console.log(" users:", error.message);
      toast.error("Invalid email or password", { closeButton: true })
    }
  };

  return (
    <div className="flex md:flex-row flex-col items-center justify-around h-[90vh] text-black mb-15 md:mb-0 lg:gap-10 gap-5">
      <div className="bg-blue-200 w-[90%] lg:w-[30%] md:h-[65%] md:m-10 m-2 rounded-2xl shadow-2xl shadow-black/50">
        <form onSubmit={handleLogIn} className="lg:p-10 p-5 flex flex-col gap-3 md:mx-5">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Log In</h1>
          
          <h2 className="text-lg font-medium text-gray-900">Username Or Email</h2>
          <input
            type="text"
            className="focus:border-gray-900 border border-gray-500 rounded-lg w-full p-2 resize-none"
            placeholder="Enter Your Email Address OR Username *"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h2 className="text-lg font-medium text-gray-900">Password</h2>
          <input
            type="password"
            className="focus:border-gray-900 border border-gray-500 rounded-lg w-full p-2 resize-none"
            placeholder="Enter Your Password *"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 mt-3 font-semibold text-white px-3 py-2 rounded-lg text-xl"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
