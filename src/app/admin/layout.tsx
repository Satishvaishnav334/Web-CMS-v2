"use client";

import React, { useState, useEffect, JSX } from "react";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
 
  return (
    <div className="">
      {/* <Navbar adminLinks={links} /> */}
      {children}
    </div>
  );
}
