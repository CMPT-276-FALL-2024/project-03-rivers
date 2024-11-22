import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

  // Add more detailed logging for debugging
  console.log("Environment check:", {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  });

  if (!clientId || !clientSecret) {
    console.error("Missing FATSECRET_CLIENT_ID or FATSECRET_CLIENT_SECRET");
    return NextResponse.json(
      { 
        error: "Configuration error: Missing Client ID or Secret",
        debug: {
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret,
          environment: process.env.NODE_ENV
        }
      },
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token fetch error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: "Failed to fetch token from FatSecret API",
          details: errorText,
          status: response.status,
          debug: {
            responseStatus: response.status,
            responseStatusText: response.statusText
          }
        },
        { status: response.status }
      );
    }

    const tokenData = await response.json();
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error("Token fetch error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
        debug: {
          errorType: error instanceof Error ? error.constructor.name : typeof error
        }
      },
      { status: 500 }
    );
  }
}

