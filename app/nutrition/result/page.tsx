//@/app/result/page.tsx

'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CaloreisCard} from "./components/calories-card";
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

function NutritionContent() {
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const searchParams = useSearchParams();
  const foodId = searchParams.get('id');
  const imageUrl = searchParams.get('image');

  const fetchNutritionData = useCallback(async (id: string) => {
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
    }
  }, [imageUrl]);

  useEffect(() => {
    if (foodId) {
      fetchNutritionData(foodId);
    }
  }, [foodId, fetchNutritionData]);

  if (!nutritionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="min-h-screen p-4">
        <h1 className="text-center text-4xl font-bold mb-10 text-orange-600">
          {nutritionData.foodName} Nutrition Facts
        </h1>

        <div className="flex justify-center gap-4">
          <div className="space-y-4">
            <ImageCard imageUrl={nutritionData.imageUrl} />
            <CaloreisCard
              foodName={nutritionData.foodName}
              servingSize={nutritionData.servingSize}
              calories={nutritionData.calories}
            />
          </div>

          <div>
            <NutritionFactsCard nutritionFacts={nutritionData.nutritionFacts} />
          </div>
        </div>
      </div>        
    </div>
  );
}

export default function Nutrition() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NutritionContent />
    </Suspense>
  );
}

