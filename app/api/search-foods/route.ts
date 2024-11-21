import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // リクエストボディのログ
    const body = await req.json();
    console.log("Request body:", body);
    const { searchQuery } = body;

    if (!searchQuery) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    console.log("Fetching token...");
    // トークンを取得
    const tokenResponse = await fetch("http://localhost:3000/api/fatsecret");
    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error("Token fetch error:", tokenError);
      return NextResponse.json(
        { error: "Failed to obtain access token" },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log("Token received:", tokenData.access_token ? "Valid token" : "Invalid token");

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Invalid access token received" },
        { status: 500 }
      );
    }

    // FatSecret APIのURLを構築
    const apiUrl = new URL("https://platform.fatsecret.com/rest/server.api");
    apiUrl.searchParams.append("method", "foods.search.v3");
    apiUrl.searchParams.append("search_expression", searchQuery);
    apiUrl.searchParams.append("format", "json");
    apiUrl.searchParams.append("max_results", "6");
    apiUrl.searchParams.append("include_food_images", "true");

    console.log("Calling FatSecret API with URL:", apiUrl.toString());

    // FatSecret APIを呼び出し
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
          details: errorText,
          status: foodResponse.status 
        },
        { status: foodResponse.status }
      );
    }

    const foodData = await foodResponse.json();
    console.log("Food data received:", foodData);

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
