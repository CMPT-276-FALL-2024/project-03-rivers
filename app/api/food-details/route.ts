import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const foodId = searchParams.get('id');

  if (!foodId) {
    return NextResponse.json({ error: "Food ID is required" }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch(`${request.nextUrl.origin}/api/fatsecret`);
    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error("Failed to obtain access token");
    }

    const apiUrl = `https://platform.fatsecret.com/rest/server.api?method=food.get.v2&food_id=${foodId}&format=json`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`FatSecret API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log('FatSecret API Image URL:', data.food.food_image); // Add logging

    const nutritionData = {
      foodName: data.food.food_name,
      calories: parseFloat(data.food.servings.serving[0].calories),
      servingSize: data.food.servings.serving[0].serving_description,
      nutritionFacts: {
        totalFat: parseFloat(data.food.servings.serving[0].fat),
        saturatedFat: parseFloat(data.food.servings.serving[0].saturated_fat),
        transFat: parseFloat(data.food.servings.serving[0].trans_fat),
        cholesterol: parseFloat(data.food.servings.serving[0].cholesterol),
        sodium: parseFloat(data.food.servings.serving[0].sodium),
        totalCarbohydrate: parseFloat(data.food.servings.serving[0].carbohydrate),
        dietaryFiber: parseFloat(data.food.servings.serving[0].fiber),
        totalSugars: parseFloat(data.food.servings.serving[0].sugar),
        protein: parseFloat(data.food.servings.serving[0].protein),
        vitaminA: parseFloat(data.food.servings.serving[0].vitamin_a),
        vitaminC: parseFloat(data.food.servings.serving[0].vitamin_c),
        calcium: parseFloat(data.food.servings.serving[0].calcium),
        iron: parseFloat(data.food.servings.serving[0].iron),
      },
      imageUrl: data.food.food_image || 'https://via.placeholder.com/300x200?text=No+Image',
    };

    return NextResponse.json(nutritionData);
  } catch (error) {
    console.error("Error fetching food details:", error);
    return NextResponse.json(
      { error: "Failed to fetch food details", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

