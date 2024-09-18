"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from './components/NavWrapper'; // Import the Navbar
import { usePathname } from 'next/navigation'; // Import the hook to get the current path

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current path

  // Define a condition to check if we are on the landing page
  const isLandingPage = pathname === "/"; 

  return (
    <html lang="en">
      <head>
        <title>NutriTrack</title>
        <meta name="description" content="Yo mama" />
      </head>
      <body className={`${inter.className} bg-white`}>
        {!isLandingPage && <NavbarWrapper />} {/* Render Navbar only if not on the landing page */}
        <main className={`ml-0 sm:ml-64 p-4 sm:p-8 transition-all duration-300 ease-in-out`}>
          {children}
        </main>
      </body>
    </html>
  );
}
