"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to search results page with the query
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center w-full max-w-2xl mx-auto">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/favicon.ico"
            alt="Search Engine Logo"
            width={100}
            height={100}
            priority
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-2">Search Engine</h1>
        </div>
        
        <form onSubmit={handleSearch} className="w-full">
          <div className="flex w-full rounded-full overflow-hidden border border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the web..."
              className="flex-grow px-6 py-4 outline-none dark:bg-gray-800 text-lg"
              aria-label="Search query"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </main>
      
      <footer className="mt-auto py-6 text-sm text-gray-600 dark:text-gray-400">
        <p>© 2025 Search Engine</p>
      </footer>
    </div>
  );
}
