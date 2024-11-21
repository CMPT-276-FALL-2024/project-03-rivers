// app/api/fatsecret/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

  // 環境変数のチェックとログ
  console.log("Environment check:", {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    nodeEnv: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL_URL
  });

  if (!clientId || !clientSecret) {
    console.error("Missing credentials");
    return NextResponse.json(
      { error: "Configuration error: Missing Client ID or Secret" },
      { status: 500 }
    );
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    
    const response = await fetch("https://oauth.fatsecret.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials&scope=premier",
    });

    console.log("FatSecret token response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token fetch error:", errorText);
      return NextResponse.json(
        { 
          error: "Failed to fetch token from FatSecret API",
          details: errorText
        },
        { status: response.status }
      );
    }

    const tokenData = await response.json();
    console.log("Token fetch successful");

    return NextResponse.json(tokenData);
  } catch (error) {
    console.error("Token fetch error details:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
