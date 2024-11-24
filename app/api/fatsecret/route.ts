import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;
  const envDebug = {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    nodeEnv: process.env.NODE_ENV,
  };
  console.log("Environment variables check:", envDebug);
  
  if (!clientId || !clientSecret) {
    console.error("Missing credentials:", envDebug);
    return NextResponse.json(
      { 
        error: "Configuration error: Missing API credentials",
        debug: envDebug
      },
      { status: 500 }
    );
  }
  
  try {
    const credentials = btoa(`${clientId}:${clientSecret}`);
    const tokenUrl = "https://oauth.fatsecret.com/connect/token";
    console.log("Requesting token from:", tokenUrl);
    
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials&scope=premier",
    });
    
    const responseText = await response.text();
    console.log("Token response status:", response.status);
    
    if (!response.ok) {
      console.error("Token fetch failed:", {
        status: response.status,
        response: responseText
      });
      return NextResponse.json(
        { 
          error: "Failed to fetch token",
          details: responseText,
          debug: {
            status: response.status,
            statusText: response.statusText
          }
        },
        { status: response.status }
      );
    }
    
    try {
      const tokenData = JSON.parse(responseText);
      return NextResponse.json(tokenData);
    } catch (parseError) {
      console.error("Token parse error:", parseError);
      return NextResponse.json(
        { 
          error: "Invalid token response",
          details: responseText
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Token fetch error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

