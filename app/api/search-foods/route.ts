import { NextRequest, NextResponse } from "next/server";

// Helper function to get search query
function getSearchQuery(req: NextRequest) {
  // For POST requests, get from body
  if (req.method === 'POST') {
    return req.json().then(body => body.searchQuery);
  }
  // For GET requests, get from URL params
  const url = new URL(req.url);
  return Promise.resolve(url.searchParams.get('q') || '');
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  try {
    const searchQuery = await getSearchQuery(req);

    if (!searchQuery) {
      return NextResponse.json(
        { error: "Search query is required. Use 'q' parameter for GET or 'searchQuery' in POST body" },
        { status: 400 }
      );
    }

    // Get base URL for API calls
    const protocol = process.env.VERCEL_URL ? 'https' : 'http';
    const baseUrl = process.env.VERCEL_URL 
      ? `${protocol}://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    // Get token with better error handling
    const tokenResponse = await fetch(`${baseUrl}/api/fatsecret`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error("Token fetch error:", {
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
          error: "Invalid access token received",
          details: "Token response did not contain access_token"
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
          error: "Failed to fetch foods from FatSecret API",
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

