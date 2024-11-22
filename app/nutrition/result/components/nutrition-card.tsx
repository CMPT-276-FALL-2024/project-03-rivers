
import * as React from "react";

export function NutritionFactsCard() {
  return (
    <div className="mx-auto rounded-lg border border-gray-200 shadow-lg p-4 h-[610px] w-[580px] ">
      <div className="flex justify-between font-bold mb-2">
        <span>% Daily Value</span>
        <span>0%</span>
      </div>
      <hr className="my-2 border-gray-400" />

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Total Fat 0g</span>
          <span>0%</span>
        </div>
        <div className="pl-4 text-gray-500">Saturated Fat 0g</div>
        <div className="pl-4 text-gray-500">Trans Fat 0g</div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Cholesterol 0mg</span>
          <span>0%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Sodium 0mg</span>
          <span>0%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span className="font-bold">Total Carbohydrate 26mg</span>
          <span>9%</span>
        </div>
        <div className="pl-4 text-gray-500">Dietary Fiber 2g</div>
        <div className="pl-4 text-gray-500">Total Sugars 1g</div>
        <div className="pl-4 text-gray-500">Includes 0g Added Sugars 0%</div>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <span className="font-bold">Protein</span>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 border-gray-400">
        <div className="flex justify-between">
          <span>Vitamin D 0mcg</span>
          <span>0%</span>
        </div>
        <div className="flex justify-between">
          <span>Calcium 20mg</span>
          <span>2%</span>
        </div>
        <div className="flex justify-between">
          <span>Iron 1.1mg</span>
          <span>6%</span>
        </div>
        <div className="flex justify-between">
          <span>Potassium 620mg</span>
          <span>15%</span>
        </div>
        <div className="flex justify-between">
          <span>Vitamin C 27mg</span>
          <span>30%</span>
        </div>
        <div className="flex justify-between">
          <span>Vitamin B6 0.2mg</span>
          <span>10%</span>
        </div>
        <hr className="my-2 border-gray-400" />
      </div>
    </div>
  );
}
