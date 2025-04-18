import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    // Get the search query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ 
        error: 'Missing search query parameter'
      }, { status: 400 });
    }

    // Get API key from environment variables
    const apiKey = process.env.SERP_API;
    
    if (!apiKey) {
      console.error('SERP_API key is not defined in environment variables');
      return NextResponse.json({ 
        error: 'API configuration error' 
      }, { status: 500 });
    }

    const startTime = Date.now();
    console.log(`Fetching search results for query: ${query}`);
    
    // Make request to Serper.dev API
    const response = await axios({
      method: 'post',
      url: 'https://google.serper.dev/search',
      headers: { 
        'X-API-KEY': apiKey, 
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        "q": query
      })
    });
    
    const data = response.data;
    const searchTime = (Date.now() - startTime) / 1000;
    
    // Format the response to match the structure expected by the results page
    // Adjust this based on Serper.dev's actual response structure
    const formattedResults = {
      items: data.organic?.map(result => ({
        title: result.title,
        link: result.link,
        displayLink: result.displayedUrl || new URL(result.link).hostname,
        snippet: result.snippet
      })) || [],
      totalResults: data.searchParameters?.totalResults || 
                   data.searchInformation?.totalResults || 1000,
      searchTime: searchTime
    };
    
    return NextResponse.json(formattedResults);
    
  } catch (error) {
    console.error('Search API error:', error.response?.data || error.message);
    return NextResponse.json({ 
      error: 'Failed to fetch search results',
      message: error.response?.data?.message || error.message 
    }, { status: error.response?.status || 500 });
  }
}