// app/api/search-foods/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { searchQuery } = body;

    if (!searchQuery) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // 相対パスを使用するか、req.urlからベースURLを取得
    const protocol = process.env.VERCEL_URL ? 'https' : 'http';
    const baseUrl = process.env.VERCEL_URL 
      ? `${protocol}://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    // トークン取得のURLを動的に構築
    const tokenResponse = await fetch(`${baseUrl}/api/fatsecret`);
    
    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error("Token fetch error:", tokenError);
      return NextResponse.json(
        { error: "Failed to obtain access token" },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Invalid access token received" },
        { status: 500 }
      );
    }

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
      console.error("FatSecret API error:", errorText);
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
    console.error("Detailed API Route Error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
