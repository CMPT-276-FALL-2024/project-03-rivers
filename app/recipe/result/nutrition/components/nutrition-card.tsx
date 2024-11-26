'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";

interface NutritionInfo {
  nutrients: {
    name: string;
    amount: number;
    unit: string;
    percentOfDailyNeeds: number;
  }[];
}

const nutrientCategories = {
  "Macronutrients": ["Protein", "Carbohydrates", "Fat", "Fiber"],
  "Vitamins": ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E", "Vitamin K", "Vitamin B6", "Vitamin B12"],
  "Minerals": ["Calcium", "Iron", "Magnesium", "Phosphorus", "Potassium", "Sodium", "Zinc"],
  "Others": []
};

export function NutritionFactsCard() {
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");

  useEffect(() => {
    const fetchNutritionInfo = async () => {
      if (!recipeId) return;
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`);
        if (!response.ok) {
          throw new Error('Failed to fetch nutrition information');
        }
        const data = await response.json();
        setNutritionInfo(data);
      } catch (error) {
        console.error("Failed to fetch nutrition information:", error);
        setError('Failed to load nutrition information. Please try again later.');
      }
    };

    fetchNutritionInfo();
  }, [recipeId]);

  if (error) return <Card className="p-4"><p className="text-red-500">{error}</p></Card>;
  if (!nutritionInfo) return <Card className="p-4"><p>Loading nutrition information...</p></Card>;

  const categorizedNutrients = nutritionInfo.nutrients.reduce((acc, nutrient) => {
    let category = "Others";
    for (const [cat, nutrients] of Object.entries(nutrientCategories) as [string, string[]][]) {
      if (nutrients.includes(nutrient.name)) {
        category = cat;
        break;
      }
    }
    if (!acc[category]) acc[category] = [];
    acc[category].push(nutrient);
    return acc;
  }, {} as Record<string, typeof nutritionInfo.nutrients>);

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-lg p-4 h-[610px] overflow-y-auto">
      <div className="grid grid-cols-3 font-bold mb-2 text-sm">
        <span>Nutrient</span>
        <span className="text-right">Amount</span>
        <span className="text-right">% Daily Value</span>
      </div>
      <hr className="my-2 border-gray-400" />

      {Object.entries(categorizedNutrients).map(([category, nutrients]) => (
        <div key={category} className="mb-4">
          <h3 className="font-bold text-lg mb-2">{category}</h3>
          {nutrients.map((nutrient, index) => (
            <div key={index} className="grid grid-cols-3 mb-1 text-sm">
              <span>{nutrient.name}</span>
              <span className="text-right">{nutrient.amount}{nutrient.unit}</span>
              <span className="text-right">{nutrient.percentOfDailyNeeds}%</span>
            </div>
          ))}
          <hr className="my-2 border-gray-400" />
        </div>
      ))}
    </Card>
  );
}

