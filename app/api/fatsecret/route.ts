// app/api/fatsecret/route.ts
import { NextResponse } from "next/server";

export async function GET() {  // reqパラメータを削除
  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Missing FATSECRET_CLIENT_ID or FATSECRET_CLIENT_SECRET");
    return NextResponse.json(
      { error: "Configuration error: Missing Client ID or Secret" },
      { status: 500 }
    );
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    console.log("Requesting token with credentials...");

    const response = await fetch("https://oauth.fatsecret.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials&scope=premier",
    });

    console.log("Token response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token fetch error:", errorText);
      return NextResponse.json(
        { 
          error: "Failed to fetch token from FatSecret API",
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }

    const tokenData = await response.json();
    console.log("Token successfully retrieved");

    return NextResponse.json(tokenData);
  } catch (error) {
    console.error("Detailed token fetch error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
