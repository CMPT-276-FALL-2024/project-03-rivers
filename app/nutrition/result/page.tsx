"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CaloreisCard } from "./components/calories-card";
import { ImageCard } from "./components/image-card";
import { NutritionFactsCard } from "./components/nutrition-card";

interface NutritionData {
  foodName: string;
  calories: number;
  servingSize: string;
  nutritionFacts: {
    totalFat: number;
    saturatedFat: number;
    transFat: number;
    cholesterol: number;
    sodium: number;
    totalCarbohydrate: number;
    dietaryFiber: number;
    totalSugars: number;
    protein: number;
    vitaminA: number;
    vitaminC: number;
    calcium: number;
    iron: number;
  };
  imageUrl: string;
}

export default function Nutrition() {
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const searchParams = useSearchParams();
  const foodId = searchParams.get('id');
  const imageUrl = searchParams.get('image');

  useEffect(() => {
    if (foodId) {
      fetchNutritionData(foodId);
    }
  }, [foodId]);

  const fetchNutritionData = async (id: string) => {
    try {
      const response = await fetch(`/api/food-details?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch food details');
      }
      const data = await response.json();
      setNutritionData({
        ...data,
        imageUrl: imageUrl || data.imageUrl || '/default-food-image.png'
      });
    } catch (error) {
      console.error('Error fetching food details:', error);
      // エラー処理（例：トースト通知の表示）
    }
  };

  if (!nutritionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="min-h-screen p-4">
        <h1 className="text-center text-5xl font-bold mb-8 text-orange-600">
          {nutritionData.foodName} Nutrition Facts
        </h1>

        <div className="grid grid-rows-2 grid-cols-2 gap-2 h-[800px]">
          <div className="row-span-1 col-span-1">
            <ImageCard imageUrl={nutritionData.imageUrl} />
          </div>

          <div className="row-span-2 col-span-1">
            <NutritionFactsCard nutritionFacts={nutritionData.nutritionFacts} />
          </div>

          <div className="row-span-1 col-span-1">
            <CaloreisCard 
              foodName={nutritionData.foodName}
              servingSize={nutritionData.servingSize}
              calories={nutritionData.calories}
            />
          </div>
        </div>
      </div>        
    </div>
  );
}

