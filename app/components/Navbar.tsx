"use client"

import Link from 'next/link';
import { FaHome, FaBullseye, FaUtensils, FaCog, FaChartLine } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-white h-full p-4">
      {/* Logo or Title */}
      <div className="flex justify-center text-center pb-1">
        <Link href="/" className="text-green-600 justify-between font-bold text-2xl flex items-center flex left">
          
          <div className="items-center">NutriTrack</div>
          
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-4">
        <NavItem href="/pages/home" icon={<FaHome />} text="Home" />
        <NavItem href="/pages/goals" icon={<FaBullseye />} text="Goals" />
        <NavItem href="/pages/recipes" icon={<FaUtensils />} text="Recipes" />
        <NavItem href="/pages/settings" icon={<FaCog />} text="Settings" />
      </ul>
    </nav>
  );
}

function NavItem({ href, icon, text }: { href: string, icon: React.ReactNode, text: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <span className="mr-3">{icon}</span>
        {text}
      </Link>
    </li>
  );
}
