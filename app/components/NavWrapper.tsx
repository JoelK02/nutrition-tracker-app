"use client"; // This is now a Client Component

import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Navbar from './Navbar'; // Import your existing Navbar

export default function NavbarWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 z-40`}
      >
        <Navbar />
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 sm:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
