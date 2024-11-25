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
          throw new Error('カロリー情報の取得に失敗しました');
        }
        const data = await response.json();
        setCalorieInfo({
          calories: data.calories,
          servings: data.numberOfServings
        });
      } catch (error) {
        console.error("カロリー情報の取得に失敗しました:", error);
        setError('カロリー情報の読み込みに失敗しました。後でもう一度お試しください。');
      }
    };

    fetchCalorieInfo();
  }, [recipeId]);

  if (error) return <Card className="p-4"><p className="text-red-500">{error}</p></Card>;
  if (!calorieInfo) return <Card className="p-4"><p>カロリー情報を読み込み中...</p></Card>;

  return (
    <Card className="border border-gray-200 shadow-lg h-[205px] p-4 flex flex-col justify-center">
      <div className="text-lg font-medium mb-2">レシピのカロリー情報</div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-3xl font-bold">カロリー</div>
          <div className="text-sm text-gray-500">1人分あたり</div>
        </div>
        <div className="text-5xl font-semibold text-gray-600">{calorieInfo.calories}kcal</div>
      </div>
      <div className="text-sm text-gray-500">サービング数: {calorieInfo.servings}</div>
      <hr className="my-2 border-gray-400" />
    </Card>
  );
}

