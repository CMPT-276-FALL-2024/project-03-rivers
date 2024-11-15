// app/recipe/result/components/RecipeInfo.tsx
"use client";

import Image from "next/image";
import CheckBox from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

const RecipeInfo = ({ recipeId }: { recipeId: number }) => {
  const [recipe, setRecipe] = useState<any>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State to manage the checked status of each ingredient
  //const [ingredients, setIngredients] = useState({
    //Tomatoes: false,
 //   Pasta: false,
  //  Basil: false,
   // OliveOil: false,
   // Garlic: false,
  //});

  // Fetch recipe details and equipment using Spoonacular API
  useEffect(() => {
    async function fetchRecipeData() {
      try {
        // Fetch recipe information
        const recipeResponse = await fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=558962dbe7bf476fb544208d0d9fece3`
        );
        const recipeData = await recipeResponse.json();
        console.log("Fetched Recipe Data:", recipeData);

        setRecipe(recipeData);

        // Fetch equipment information
        const equipmentResponse = await fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/equipmentWidget.json?apiKey=558962dbe7bf476fb544208d0d9fece3`
        );
        const equipmentData = await equipmentResponse.json();
        setEquipment(equipmentData.equipment || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipeData();
  }, [recipeId]);

  // Handler to toggle checkbox state
  const handleCheckboxChange = (ingredient: string, checked: boolean) => {
    setIngredients((prevIngredients) => ({
      ...prevIngredients,
      [ingredient]: checked,
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe data not available.</p>;

  return (
    <div className="space-y-6">
      {/* Image Section */}
      <div className="flex justify-center">
        <Image
          src={recipe.image}
          alt={recipe.title}
          width={500}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Recipe Details */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
        <p>
          <strong>Servings:</strong> {recipe.servings}
        </p>
        <p>
          <strong>Preparation Time:</strong> {recipe.readyInMinutes} minutes
        </p>
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
          {recipe.extendedIngredients.map((ingredient: any) => (
            <li key={ingredient.id}>
              <CheckBox
                label={ingredient.original} // Display the ingredient description
                checked={false} // Adjust as needed for interactive behavior
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Equipment */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Required Equipment</h2>
        <ul className="list-disc pl-6 space-y-2">
          {equipment.map((item, index) => (
            <li key={item.id || index}>
              <span className="capitalize">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeInfo;
