//a
//@app/api/search-foods/route.ts

import { NextRequest, NextResponse } from "next/server";

async function getSearchQuery(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      return body.searchQuery || '';
    } catch {
      return '';
    }
  }
  const url = new URL(req.url);
  return url.searchParams.get('q') || '';
}

async function handleRequest(req: NextRequest) {
  try {
    const searchQuery = await getSearchQuery(req);

    if (!searchQuery) {
      return NextResponse.json(
        { 
          error: "Search query is required",
          message: "Please provide a search query using the 'q' parameter for GET requests or 'searchQuery' in the JSON body for POST requests."
        },
        { status: 400 }
      );
    }

    // Get the correct base URL for the environment
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    console.log("Using base URL:", baseUrl);

    // Fetch token with absolute URL
    const tokenResponse = await fetch(`${baseUrl}/api/fatsecret`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error("Token fetch failed:", {
        status: tokenResponse.status,
        error: tokenError
      });
      return NextResponse.json(
        { 
          error: "Failed to obtain access token",
          details: tokenError
        },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("Invalid token response:", tokenData);
      return NextResponse.json(
        { 
          error: "Invalid token response",
          details: "No access token in response"
        },
        { status: 500 }
      );
    }

    // Call FatSecret API
    const apiUrl = new URL("https://platform.fatsecret.com/rest/server.api");
    apiUrl.searchParams.append("method", "foods.search.v3");
    apiUrl.searchParams.append("search_expression", searchQuery);
    apiUrl.searchParams.append("format", "json");
    apiUrl.searchParams.append("max_results", "6");
    apiUrl.searchParams.append("include_food_images", "true");

    const foodResponse = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!foodResponse.ok) {
      const errorText = await foodResponse.text();
      console.error("FatSecret API error:", {
        status: foodResponse.status,
        error: errorText
      });
      return NextResponse.json(
        { 
          error: "Failed to fetch foods",
          details: errorText 
        },
        { status: foodResponse.status }
      );
    }

    const foodData = await foodResponse.json();
    return NextResponse.json(foodData);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

