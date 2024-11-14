// file: app/recipe/result.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface RecipeDetail {
    id: number;
    title: string;
    image: string;
    instructions: string;
    ingredients: { name: string; amount: string }[];
}

export default function RecipeDetailPage() {
    const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const recipeId = searchParams.get("id");

    useEffect(() => {
        if (recipeId) {
            fetchRecipeDetail(recipeId);
        }
    }, [recipeId]);

    const fetchRecipeDetail = async (id: string) => {
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`);
            const data = await response.json();
            setRecipe({
                id: data.id,
                title: data.title,
                image: data.image,
                instructions: data.instructions,
                ingredients: data.extendedIngredients.map((ingredient: any) => ({
                    name: ingredient.name,
                    amount: `${ingredient.amount} ${ingredient.unit}`,
                })),
            });
        } catch (error) {
            console.error("Failed to fetch recipe details:", error);
        }
    };

    if (!recipe) return <p>Loading...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>
            <Image src={recipe.image} alt={recipe.title} width={600} height={400} className="w-full h-auto rounded-md" />
            <h2 className="text-xl font-semibold mt-6 mb-2">Ingredients</h2>
            <ul className="list-disc ml-5">
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.name}: {ingredient.amount}
                    </li>
                ))}
            </ul>
            <h2 className="text-xl font-semibold mt-6 mb-2">Instructions</h2>
            <p>{recipe.instructions}</p>
        </div>
    );
}
