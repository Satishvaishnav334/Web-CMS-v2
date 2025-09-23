"use client";

import React, { useState, useEffect, JSX } from "react";
import { PageProvider } from "@/components/context/PageContext";  
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {

  return (
    <div className="">
      <PageProvider>
        {children}
      </PageProvider>
    </div>
  );
}
