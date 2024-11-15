// app/recipe/result/components/RecipeInfo.tsx
"use client";

import Image from 'next/image';
import CheckBox from '@/components/ui/checkbox';
import { useState } from 'react';

const RecipeInfo = () => {
  // State to manage the checked status of each ingredient
  const [ingredients, setIngredients] = useState({
    Tomatoes: false,
    Pasta: false,
    Basil: false,
    OliveOil: false,
    Garlic: false,
  });

  // Handler to toggle checkbox state
  const handleCheckboxChange = (ingredient: string, checked: boolean) => {
    setIngredients((prevIngredients) => ({
      ...prevIngredients,
      [ingredient]: checked,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Image Section */}
      <div className="flex justify-center">
        <Image
          src="/Images/pasta.jpg" // Replace with your actual path
          alt="Delicious pasta dish"
          width={500}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Caloric Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calories</h2>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Calories:</strong> ~666</li>
          <li><strong>Protein:</strong> ~20g</li>
          <li><strong>Fat:</strong> ~10g</li>
          <li><strong>Carbohydrates:</strong> ~10g</li>
        </ul>
      </div>

      {/* Ingredients List */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h2>
        <ul className="space-y-3">
          {Object.keys(ingredients).map((ingredient) => (
            <li key={ingredient}>
              <CheckBox
                label={ingredient}
                checked={ingredients[ingredient as keyof typeof ingredients]}
                onChange={(checked) => handleCheckboxChange(ingredient, checked)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeInfo;
