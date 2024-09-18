import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from './components/NavWrapper'; // Import the new Client Component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NutriTrack",
  description: "Your personal nutrition tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${inter.className} bg-white`}>
        <NavbarWrapper /> {/* Client Component that handles sidebar toggle */}
        <main className="ml-0 sm:ml-64 p-4 sm:p-8 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </body>
    </html>
  );
}
