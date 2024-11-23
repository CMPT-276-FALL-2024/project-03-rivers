import * as React from "react";

interface NutritionFactsCardProps {
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
}

export function NutritionFactsCard({ nutritionFacts }: NutritionFactsCardProps) {
  return (
    <div className="mx-auto rounded-lg border border-gray-200 shadow-lg p-4 h-[610px] w-[580px]">
      <div className="flex justify-between font-bold mb-2">
        <span>% Daily Value</span>
      </div>
      <hr className="my-2 border-gray-400" />

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Total Fat {nutritionFacts.totalFat}g</span>
          <span>{Math.round((nutritionFacts.totalFat / 65) * 100)}%</span>
        </div>
        <div className="pl-4 text-gray-500">Saturated Fat {nutritionFacts.saturatedFat}g</div>
        <div className="pl-4 text-gray-500">Trans Fat {nutritionFacts.transFat}g</div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Cholesterol {nutritionFacts.cholesterol}mg</span>
          <span>{Math.round((nutritionFacts.cholesterol / 300) * 100)}%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Sodium {nutritionFacts.sodium}mg</span>
          <span>{Math.round((nutritionFacts.sodium / 2300) * 100)}%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Total Carbohydrate {nutritionFacts.totalCarbohydrate}g</span>
          <span>{Math.round((nutritionFacts.totalCarbohydrate / 300) * 100)}%</span>
        </div>
        <div className="pl-4 text-gray-500">Dietary Fiber {nutritionFacts.dietaryFiber}g</div>
        <div className="pl-4 text-gray-500">Total Sugars {nutritionFacts.totalSugars}g</div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <span className="font-bold">Protein {nutritionFacts.protein}g</span>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span>Vitamin A {nutritionFacts.vitaminA}mcg</span>
          <span>{Math.round((nutritionFacts.vitaminA / 900) * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Vitamin C {nutritionFacts.vitaminC}mg</span>
          <span>{Math.round((nutritionFacts.vitaminC / 90) * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Calcium {nutritionFacts.calcium}mg</span>
          <span>{Math.round((nutritionFacts.calcium / 1300) * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Iron {nutritionFacts.iron}mg</span>
          <span>{Math.round((nutritionFacts.iron / 18) * 100)}%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>
    </div>
  );
}

