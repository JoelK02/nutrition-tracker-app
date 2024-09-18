"use client";
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Welcome to NutriTrack
        </h1>
        <p className="text-gray-600 mb-8">
          Track your nutrition, set goals, and reach your fitness potential.
        </p>

        <div className="space-y-4">
          {/* Log In Button */}
          <Link href="/signin">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition">
              Log In
            </button>
          </Link>

          {/* Sign Up Button */}
          <Link href="/signup">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
