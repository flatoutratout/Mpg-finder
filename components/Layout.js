// components/Layout.js
"use client";
import Image from "next/image";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-inter bg-blue-200 text-gray-900 transition-colors duration-300">

      {/* Header */}
      <header className="bg-blue-300 shadow-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 justify-between">

          {/* Logo + Title */}
          <div className="flex items-center space-x-4">
            <Image src="/logo.png" alt="MPG Finder Logo" width={50} height={50} />
            <h1 className="text-2xl font-bold text-blue-900">MPG Finder</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex justify-center space-x-6">
            <a href="#" className="text-blue-900 hover:text-blue-700">Home</a>
            <a href="#" className="text-blue-900 hover:text-blue-700">About</a>
            <a href="#" className="text-blue-900 hover:text-blue-700">Contact</a>
          </nav>

        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-12 mt-20 text-center bg-blue-300 text-blue-900 transition-colors duration-300">
        <p>© {new Date().getFullYear()} MPG Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
