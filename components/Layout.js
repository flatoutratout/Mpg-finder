// components/Layout.js
"use client";
import { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode") === "true";
    setDarkMode(stored);
    if (stored) document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            MyWebsite
          </h1>
          <nav className="space-x-6">
            <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </a>
            <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              About
            </a>
            <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </a>
          </nav>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-4 px-2 py-1 border rounded text-sm text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        {children}
      </main>

      <footer className="bg-gray-800 dark:bg-gray-900 text-gray-200 py-12 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-8 right-8 z-50">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "300px", height: "250px" }}
          data-ad-client="ca-pub-2806617957660523"
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
    </div>
  );
}
