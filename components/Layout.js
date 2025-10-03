"use client";
import { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved preference
  useEffect(() => {
    const stored = localStorage.getItem("darkMode") === "true";
    setDarkMode(stored);
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  // Toggle handler
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            MPG Finder
          </h1>
          <nav className="space-x-6">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
              About
            </a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </a>
          </nav>
          <button
            onClick={toggleDarkMode}
            className="ml-4 px-2 py-1 border rounded text-sm border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="py-12 mt-20 text-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors duration-300">
        <p>© {new Date().getFullYear()} MPG Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
