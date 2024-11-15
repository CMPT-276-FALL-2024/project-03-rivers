// app/recipe/result/components/RecipeInfo.tsx
"use client"; // This makes it a Client Component

import Image from 'next/image';
import CheckBox from '@/components/ui/checkbox';

const RecipeInfo = () => {
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
      {/* Image Section */}
      <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center">
        <Image
          src="/Images/pasta.jpg" // Replace with your actual path
          alt="Delicious pasta dish"
          width={500}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Info Section */}
      <div className="w-full md:w-1/2 lg:w-2/3 space-y-4">
        {/* Caloric Breakdown */}
        <div className="rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Calories</h2>
          <ul className="space-y-1">
            <li>Calories: ~666</li>
            <li>Protein: ~20g</li>
            <li>Fat: ~10g</li>
            <li>Carbohydrates: ~10g</li>
          </ul>
        </div>

        {/* Ingredients List */}
        <div className="rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
          <ul className="space-y-2">
            <li><CheckBox label="Tomatoes" /></li>
            <li><CheckBox label="Pasta" /></li>
            <li><CheckBox label="Basil" /></li>
            <li><CheckBox label="Olive Oil" /></li>
            <li><CheckBox label="Garlic" /></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeInfo;
