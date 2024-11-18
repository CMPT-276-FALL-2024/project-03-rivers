import * as React from "react";

interface NutritionData {
  nf_total_fat?: number;
  nf_saturated_fat?: number;
  nf_trans_fat?: number;
  nf_cholesterol?: number;
  nf_sodium?: number;
  nf_total_carbohydrate?: number;
  nf_dietary_fiber?: number;
  nf_sugars?: number;
  nf_protein?: number;
  nf_vitamin_d_mcg?: number;
  nf_calcium_mg?: number;
  nf_iron_mg?: number;
  nf_potassium_mg?: number;
  [key: string]: any;
}

export function NutritionFactsCard({ nutritionData }: { nutritionData: NutritionData | null }) {
  if (!nutritionData) {
    return <div className="text-center">Loading nutrition data...</div>;
  }

  return (
    <div className="mx-auto rounded-lg border border-gray-200 shadow-lg p-4 h-[610px] w-[580px] ">
      <div className="flex justify-between font-bold mb-2">
        <span>% Daily Value</span>
        <span>--%</span>
      </div>
      <hr className="my-2 border-gray-400" />

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Total Fat {nutritionData.nf_total_fat || 0}g</span>
          <span>--%</span>
        </div>
        <div className="pl-4 text-gray-500">Saturated Fat {nutritionData.nf_saturated_fat || 0}g</div>
        <div className="pl-4 text-gray-500">Trans Fat {nutritionData.nf_trans_fat || 0}g</div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Cholesterol {nutritionData.nf_cholesterol || 0}mg</span>
          <span>--%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Sodium {nutritionData.nf_sodium || 0}mg</span>
          <span>--%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Total Carbohydrate {nutritionData.nf_total_carbohydrate || 0}g</span>
          <span>--%</span>
        </div>
        <div className="pl-4 text-gray-500">Dietary Fiber {nutritionData.nf_dietary_fiber || 0}g</div>
        <div className="pl-4 text-gray-500">Total Sugars {nutritionData.nf_sugars || 0}g</div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <span className="font-bold">Protein {nutritionData.nf_protein || 0}g</span>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span>Vitamin D {nutritionData.nf_vitamin_d_mcg || 0}mcg</span>
          <span>--%</span>
        </div>
        <div className="flex justify-between">
          <span>Calcium {nutritionData.nf_calcium_mg || 0}mg</span>
          <span>--%</span>
        </div>
        <div className="flex justify-between">
          <span>Iron {nutritionData.nf_iron_mg || 0}mg</span>
          <span>--%</span>
        </div>
        <div className="flex justify-between">
          <span>Potassium {nutritionData.nf_potassium_mg || 0}mg</span>
          <span>--%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>
    </div>
  );
}
