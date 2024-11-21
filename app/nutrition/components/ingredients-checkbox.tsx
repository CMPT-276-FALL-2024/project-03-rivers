"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const items = [
  { id: "potato", label: "Potato", value: "potato" },
  { id: "carrot", label: "Carrot", value: "carrot" },
  { id: "broccoli", label: "Broccoli", value: "broccoli" },
  { id: "chicken", label: "Chicken", value: "chicken" },
  { id: "pork", label: "Pork", value: "pork" },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one ingredient.",
  }),
});

interface Recipe {
  id: number;
  name: string;
  image: string;
}

export function CheckboxIngredients({
  onRecipesFetched,
}: {
  onRecipesFetched: (recipes: Recipe[]) => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  async function fetchAccessToken(): Promise<string> {
    try {
      const response = await fetch("/api/apiToken", { method: "GET" });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch access token: ${errorData}`);
      }
  
      const tokenData = await response.json();
      return tokenData.access_token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw new Error("Unable to obtain access token. Please try again.");
    }
  }
  

  async function fetchRecipes(ingredients: string[]) {
    try {
      const ingredientsQuery = ingredients
        .map((ingredient) => items.find((i) => i.id === ingredient)?.value)
        .join(",");
      if (!ingredientsQuery) throw new Error("No valid ingredients selected");

      const accessToken = await fetchAccessToken();

      const response = await fetch(
        `https://platform.fatsecret.com/rest/server.api?method=recipes.search&format=json&max_results=10&search_expression=${encodeURIComponent(
          ingredientsQuery
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to fetch recipes: ${response.status} ${response.statusText} - ${errorData}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.recipes || !data.recipes.recipe || !Array.isArray(data.recipes.recipe)) {
        throw new Error("Invalid API response format.");
      }

      const recipes: Recipe[] = data.recipes.recipe.map(
        (recipe: { recipe_id: number; recipe_name: string; recipe_image: string }) => ({
          id: recipe.recipe_id,
          name: recipe.recipe_name,
          image: recipe.recipe_image,
        })
      );

      onRecipesFetched(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch recipes. Please try again later.",
      });
      onRecipesFetched([]);
    }
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    fetchRecipes(data.items);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Ingredients</FormLabel>
                <FormDescription>
                  Select the ingredients you want to base your recipe search on.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, item.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Search Recipes</Button>
      </form>
    </Form>
  );
}

