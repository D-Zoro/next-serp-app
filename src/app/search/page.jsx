"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({ totalResults: 0, searchTime: 0 });

  useEffect(() => {
    if (!query) return;
    
    async function fetchSearchResults() {
      setLoading(true);
      try {
        // Replace with your actual SERP API endpoint
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        setResults(data.items || []);
        setMetadata({
          totalResults: data.totalResults || 0,
          searchTime: data.searchTime || 0
        });
      } catch (err) {
        console.error("Failed to fetch search results:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header with search bar */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/" className="mr-6">
            <Image 
              src="/favicon.ico" 
              alt="Search Logo" 
              width={40} 
              height={40} 
              priority 
            />
          </Link>
          
          <form action="/search" method="get" className="flex-grow max-w-2xl">
            <input
              type="text"
              name="q"
              defaultValue={query}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              placeholder="Search the web..."
            />
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search metadata */}
        {!loading && !error && (
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            About {metadata.totalResults.toLocaleString()} results ({metadata.searchTime.toFixed(2)} seconds)
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="py-8 text-center">
            <div className="text-red-500 mb-2">Error: {error}</div>
            <p>Please try again later or modify your search query.</p>
          </div>
        )}

        {/* Results list */}
        {!loading && !error && results.length === 0 && (
          <div className="py-8 text-center">
            <p className="mb-2 text-lg">No results found for "{query}"</p>
            <p>Try different keywords or check your spelling.</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="py-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                  {result.displayLink || result.link}
                </div>
                <a 
                  href={result.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xl text-blue-600 hover:underline font-medium mb-1 block"
                >
                  {result.title}
                </a>
                <p className="text-gray-800 dark:text-gray-300">
                  {result.snippet}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <p>© 2025 Search Engine</p>
      </footer>
    </div>
  );
}