import React, { useState, useEffect } from 'react';

interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  instructions: string;
  extendedIngredients: { name: string; amount: number; unit: string }[];
}

export default function MockRecipeDetail({ recipeId }: { recipeId: string }) {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipe details');
        }
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Failed to fetch recipe details:", error);
        setError('Failed to fetch recipe details');
      }
    };

    fetchRecipeDetail();
  }, [recipeId]);

  if (error) return <div data-testid="error-message">{error}</div>;
  if (!recipe) return <div data-testid="loading-message">Loading</div>;

  return (
    <div>
      <h1>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      <h2>Ingredients:</h2>
      <ul>
        {recipe.extendedIngredients.map((ingredient, index) => (
          <li key={index}>{`${ingredient.name}: ${ingredient.amount} ${ingredient.unit}`}</li>
        ))}
      </ul>
      <h2>Instructions:</h2>
      <p>{recipe.instructions}</p>
    </div>
  );
}

