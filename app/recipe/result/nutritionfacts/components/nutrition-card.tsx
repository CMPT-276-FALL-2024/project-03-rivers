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

  return (
    <Card className="border border-gray-200 shadow-lg p-4 h-[610px] overflow-y-auto">
      <div className="flex justify-between font-bold mb-2">
        <span>Nutrient</span>
        <span>Amount</span>
        <span>% Daily Value</span>
      </div>
      <hr className="my-2 border-gray-400" />

      {nutritionInfo.nutrients.map((nutrient, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between">
            <span className="font-bold">{nutrient.name}</span>
            <span>{nutrient.amount}{nutrient.unit}</span>
            <span>{nutrient.percentOfDailyNeeds}%</span>
          </div>
          <hr className="my-2 border-gray-400" />
        </div>
      ))}
    </Card>
  );
}
//test
