"use client";

import { Checkbox } from "@/components/ui/checkbox";

const ingredients = ["Potato", "Carrot", "Broccoli", "Chicken", "Pork"];

export function CheckboxFood() {
  return (
    <div className="space-y-2">
      <p>Select the ingredients you want to base your recipe search on.</p>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Checkbox id={ingredient.toLowerCase()} />
          <label
            htmlFor={ingredient.toLowerCase()}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {ingredient}
          </label>
        </div>
      ))}
    </div>
  );
}
