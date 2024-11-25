'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

interface CalorieInfo {
  calories: number;
  servings: number;
}

export function CaloriesCard() {
  const [calorieInfo, setCalorieInfo] = useState<CalorieInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");

  useEffect(() => {
    const fetchCalorieInfo = async () => {
      if (!recipeId) return;
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`);
        if (!response.ok) {
          throw new Error('Failed to fetch calorie information');
        }
        const data = await response.json();
        setCalorieInfo({
          calories: data.calories,
          servings: data.numberOfServings
        });
      } catch (error) {
        console.error("Failed to fetch calorie information:", error);
        setError('Failed to load calorie information. Please try again later.');
      }
    };

    fetchCalorieInfo();
  }, [recipeId]);

  if (error) return <Card className="p-4"><p className="text-red-500">{error}</p></Card>;
  if (!calorieInfo) return <Card className="p-4"><p>Loading calorie information...</p></Card>;

  return (
    <Card className="border border-gray-200 shadow-lg h-[205px] p-4 flex flex-col justify-center">
      <div className="text-lg font-medium mb-2">Recipe Calorie Information</div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-3xl font-bold">Calories</div>
          <div className="text-sm text-gray-500">Amount per serving</div>
        </div>
        <div className="text-5xl font-semibold text-gray-600">{calorieInfo.calories}cal</div>
      </div>
      <div className="text-sm text-gray-500">Servings: {calorieInfo.servings}</div>
      <hr className="my-2 border-gray-400" />
    </Card>
  );
}

