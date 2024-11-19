import * as React from "react"
import { Card } from "@/components/ui/card"

type NutritionFactsCardProps = {
  nutritionData: {
    carbohydrate: string
    protein: string
    fat: string
    fiber: string
    sugar: string
    sodium: string
    potassium: string
    cholesterol: string
    vitamin_c: string
    calcium: string
    iron: string
  }
}

export function NutritionFactsCard({ nutritionData }: NutritionFactsCardProps) {
  return (
    <Card className="mx-auto rounded-lg border border-gray-200 shadow-lg p-4 h-[610px] w-[580px]">
      <div className="flex justify-between font-bold mb-2">
        <span>% Daily Value</span>
      </div>
      <hr className="my-2 border-gray-400" />

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Total Fat {nutritionData.fat}g</span>
          <span>{Math.round((parseFloat(nutritionData.fat) / 65) * 100)}%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Cholesterol {nutritionData.cholesterol}mg</span>
          <span>{Math.round((parseFloat(nutritionData.cholesterol) / 300) * 100)}%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Sodium {nutritionData.sodium}mg</span>
          <span>{Math.round((parseFloat(nutritionData.sodium) / 2300) * 100)}%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Total Carbohydrate {nutritionData.carbohydrate}g</span>
          <span>{Math.round((parseFloat(nutritionData.carbohydrate) / 300) * 100)}%</span>
        </div>
        <div className="pl-4 text-gray-500">Dietary Fiber {nutritionData.fiber}g</div>
        <div className="pl-4 text-gray-500">Total Sugars {nutritionData.sugar}g</div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <span className="font-bold">Protein {nutritionData.protein}g</span>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span>Calcium {nutritionData.calcium}mg</span>
          <span>{Math.round((parseFloat(nutritionData.calcium) / 1300) * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Iron {nutritionData.iron}mg</span>
          <span>{Math.round((parseFloat(nutritionData.iron) / 18) * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Potassium {nutritionData.potassium}mg</span>
          <span>{Math.round((parseFloat(nutritionData.potassium) / 4700) * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Vitamin C {nutritionData.vitamin_c}mg</span>
          <span>{Math.round((parseFloat(nutritionData.vitamin_c) / 90) * 100)}%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>
    </Card>
  )
}