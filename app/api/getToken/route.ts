import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_SECRET_ID;

  if (!clientId || !clientSecret) {
    console.error("Missing FATSECRET_CLIENT_ID or FATSECRET_SECRET_ID");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  try {
    const response = await fetch("https://oauth.fatsecret.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "basic",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("FatSecret API error:", errorData);
      return NextResponse.json({ error: "Failed to fetch token from FatSecret API" }, { status: response.status });
    }

    const tokenData = await response.json();
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error("Error fetching token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
