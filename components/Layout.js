"use client";
import { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode") === "true";
    setDarkMode(stored);
    if (stored) document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 flex justify-between items-center px-6 py-3">
        <h1 className="text-2xl font-bold text-blue-900">MPG Finder</h1>
        <nav className="space-x-4">
          <a href="#" className="text-gray-700 hover:text-blue-900">Home</a>
          <a href="#" className="text-gray-700 hover:text-blue-900">About</a>
          <a href="#" className="text-gray-700 hover:text-blue-900">Contact</a>
        </nav>
        <button
          onClick={toggleDarkMode}
          className="ml-4 px-3 py-1 border rounded text-sm text-white bg-blue-800 hover:bg-blue-700 transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-4">{children}</main>

      {/* Footer */}
      <footer className="py-8 text-center text-white">
        <p>© {new Date().getFullYear()} MPG Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
