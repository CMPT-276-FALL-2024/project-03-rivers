"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  instructions: string;
  ingredients: { name: string; amount: string; baseAmount: number; unit: string }[];
}

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [servings, setServings] = useState(1);
  const [calculatedIngredients, setCalculatedIngredients] = useState<{ name: string; amount: string }[]>([]);
  const [notes, setNotes] = useState("");
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
      const ingredients = data.extendedIngredients.map((ingredient: any) => ({
        name: ingredient.name,
        amount: `${ingredient.amount} ${ingredient.unit}`,
        baseAmount: ingredient.amount,
        unit: ingredient.unit,
      }));
      setRecipe({
        id: data.id,
        title: data.title,
        image: data.image,
        instructions: data.instructions,
        ingredients: ingredients,
      });
      setCalculatedIngredients(ingredients);
    } catch (error) {
      console.error("Failed to fetch recipe details:", error);
    }
  };

  const calculateIngredients = () => {
    if (recipe) {
      const newIngredients = recipe.ingredients.map(ingredient => ({
        name: ingredient.name,
        amount: `${(ingredient.baseAmount * servings).toFixed(2)} ${ingredient.unit}`,
      }));
      setCalculatedIngredients(newIngredients);
    }
  };

  if (!recipe) return <p>Loading...</p>;

  const instructionSteps = recipe.instructions.split(/\d+\./).filter(step => step.trim() !== '');

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4 text-center">{recipe.title}</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <Image 
                src={recipe.image} 
                alt={recipe.title} 
                width={600} 
                height={400} 
                className="w-full h-full object-cover rounded-md" 
                layout="responsive"
              />
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <CardHeader className="px-0 pt-0 pb-2">
                  <CardTitle className="text-lg mb-2">Ingredients</CardTitle>
                </CardHeader>
                <ScrollArea className="h-[200px] pr-4">
                  {calculatedIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Checkbox id={`ingredient-${index}`} />
                      <label
                        htmlFor={`ingredient-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {ingredient.name}: {ingredient.amount}
                      </label>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            <Card className="h-[110px]">
              <CardContent className="p-2">
                <CardHeader className="px-0 pt-0 pb-2">
                  <CardTitle className="text-lg ml-1 mb-1 mt-1">Adjust Servings</CardTitle>
                </CardHeader>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    min={1}
                    className="w-20"
                  />
                  <Button onClick={calculateIngredients}>Calculate</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <CardHeader className="px-0 pt-0 pb-2">
                <CardTitle className="text-lg mb-2">Instructions</CardTitle>
              </CardHeader>
              <ScrollArea className="h-[400px] pr-4">
                <ol className="list-decimal list-inside space-y-4">
                  {instructionSteps.map((step, index) => (
                    <li key={index} className="text-sm">{step.trim()}</li>
                  ))}
                </ol>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <CardHeader className="px-0 pt-0 pb-2">
                <CardTitle className="text-lg mb-2">Notes</CardTitle>
              </CardHeader>
              <Textarea
                placeholder="Add your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-[150px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

