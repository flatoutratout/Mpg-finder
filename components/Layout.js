"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved preference
  useEffect(() => {
    const stored = localStorage.getItem("darkMode") === "true";
    setDarkMode(stored);
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <div className="min-h-screen flex flex-col font-inter bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 justify-between">

          {/* Logo + Title */}
          <div className="flex items-center space-x-4">
            <Image src="/logo.png" alt="MPG Finder Logo" width={50} height={50} />
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              MPG Finder
            </h1>
          </div>

          {/* Nav */}
          <nav className="flex-1 flex justify-center space-x-6">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">About</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
          </nav>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="ml-4 px-3 py-1 border rounded text-sm border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="py-12 mt-20 text-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors duration-300">
        <p>© {new Date().getFullYear()} MPG Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
