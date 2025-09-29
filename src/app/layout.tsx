import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";




export const metadata: Metadata = {
  title: "Web CMS 2.0",
  description: "Create web page using Web cms v2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
