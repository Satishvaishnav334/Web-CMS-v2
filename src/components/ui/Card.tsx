'use client';

import { FileText, Menu, CheckCircle, XCircle } from "lucide-react";
import { useEffect,useState } from "react";
import axios from "axios";
import pages from "@/db/models/pages";
interface DashboardCardProps {
  totalPages: number;
  livePages: number;
  draftPages: number;
  menuCount: number;
  navbarStyle: string;
  footerStyle: string;
}

export default function DashboardCard({
  totalPages,
  livePages,
  draftPages,
  menuCount,
  navbarStyle,
  footerStyle,
}: DashboardCardProps) {
  
  return (
    <div className="w-full mx-auto bg-white shadow-sm rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between gap-6">
      
      {/* Left: Stats */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <FileText className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Pages</p>
            <p className="text-lg font-semibold">{totalPages}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Menu className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="text-sm text-gray-500">Menus</p>
            <p className="text-lg font-semibold">{menuCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Live Pages</p>
            <p className="text-lg font-semibold">{livePages}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <XCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-sm text-gray-500">Draft Pages</p>
            <p className="text-lg font-semibold">{draftPages}</p>
          </div>
        </div>
      </div>

      {/* Right: Menu Styles */}
      <div className="flex-1 flex flex-col justify-center gap-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Navbar Style</p>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600">
            {navbarStyle}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Footer Style</p>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-600">
            {footerStyle}
          </span>
        </div>
      </div>

    </div>
  );
}
