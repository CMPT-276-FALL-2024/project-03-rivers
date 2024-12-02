"use client";

import React, { useState } from "react";
import { Plus } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const cuisines = [
  "African",
  "American",
  "Asian",
  "Italian",
  "Japanese",
  "Mexican",
  "Mediterranean",
  "Thai",
] as const;

const diets = [
  "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Vegan",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
] as const;

const FormSchema = z.object({
  cuisine: z.string().optional(),
  diet: z.string().optional(),
});

const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

interface Recipe {
  id: number;
  title: string;
  image: string;
}

export function SpecificSearch({ onRecipesFetched }: { onRecipesFetched: (recipes: Recipe[]) => void }) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [ingredientError, setIngredientError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const addIngredient = () => {
    if (currentIngredient && !ingredients.includes(currentIngredient)) {
      setIngredients([...ingredients, currentIngredient]);
      setCurrentIngredient("");
      setIngredientError(null); // エラーメッセージをクリア
    }
  };

  const removeIngredient = (ingredient: string) => {
    const newIngredients = ingredients.filter((i) => i !== ingredient);
    setIngredients(newIngredients);
    if (newIngredients.length === 0) {
      setIngredientError("Please add at least one ingredient.");
    }
  };

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (ingredients.length === 0) {
      setIngredientError("Please add at least one ingredient.");
      toast({
        title: "Error",
        description: "Please add at least one ingredient.",
      });
      return;
    }
    setIngredientError(null);

    try {
      const queryParams: URLSearchParams = new URLSearchParams({
        query: ingredients.join(","),
        ...(formData.cuisine && { cuisine: formData.cuisine }),
        ...(formData.diet && { diet: formData.diet.replace(" ", "") }),
        number: "6",
        apiKey: apiKey || "",
      });

      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const responseData = await response.json();
      const recipes: Recipe[] = responseData.results.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
      }));

      onRecipesFetched(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch recipes. Please try again later.",
      });
      onRecipesFetched([]);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormLabel>Ingredients</FormLabel>
          <div className="flex gap-2">
            <Input
              value={currentIngredient}
              onChange={(e) => {
                setCurrentIngredient(e.target.value);
                if (e.target.value) {
                  setIngredientError(null); 
                }
              }}
              placeholder="Enter an ingredient..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addIngredient}
              disabled={!currentIngredient}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {ingredientError && (
            <p className="text-sm text-red-500 mt-1">{ingredientError}</p>
          )}
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeIngredient(ingredient)}
                >
                  {ingredient} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="cuisine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuisine</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cuisine" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cuisines.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diet</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a diet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {diets.map((diet) => (
                    <SelectItem key={diet} value={diet.toLowerCase()}>
                      {diet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Search Recipes</Button>
      </form>
    </Form>
  );
}

