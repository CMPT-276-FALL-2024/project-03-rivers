"use client";

import Image from "next/image";
import RecipeCard from "./components/recipe-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckboxIngredients } from "./components/nutrition-selector";
import { useState } from "react";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

export default function Recipe() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const handleRecipesFetched = (fetchedRecipes: Recipe[]) => {
      console.log("Recipes received in page component:", fetchedRecipes); 
      setRecipes(fetchedRecipes);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-center mt-20 gap-6">
                <div className="w-full md:w-1/3">
                    <CheckboxIngredients onRecipesFetched={handleRecipesFetched} />
                </div>

                <Image 
                    src="/recipe/arrow.png"
                    alt="recipe image"
                    width={100}
                    height={68}
                    className="hidden md:block"
                />

                <ScrollArea className="w-full md:w-2/3 h-[700px] rounded-md border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recipes.length === 0 ? (
                            <p className="col-span-full text-center items-center justify-center text-gray-400">Select ingredients to search for recipes...</p>
                        ) : (
                            recipes.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))
                        )}
                    </div>        
                </ScrollArea>
            </div>
        </div>
    );
}

