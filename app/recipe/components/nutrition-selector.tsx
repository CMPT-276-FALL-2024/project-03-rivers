"use client";

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
  {
    id: "potato",
    label: "Potato",
    value: "potato"
  },
  {
    id: "carrot",
    label: "Carrot",
    value: "carrot"
  },
  {
    id: "broccoli",
    label: "Broccoli",
    value: "broccoli"
  },
  {
    id: "chicken",
    label: "Chicken",
    value: "chicken"
  },
  {
    id: "pork",
    label: "Pork",
    value: "pork"
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one ingredient.",
  }),
});

const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

interface Recipe {
  id: number;
  title: string;
  image: string;
}

export function CheckboxIngredients({ onRecipesFetched }: { onRecipesFetched: (recipes: Recipe[]) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  async function fetchRecipes(ingredients: string[]) {
    try {
      const ingredientsQuery = ingredients.map(ingredient => items.find(i => i.id === ingredient)?.value).join(',');
      if (!ingredientsQuery) throw new Error("No valid ingredients selected");

      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsQuery)}&number=5&ranking=1&apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch recipes");
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      if (!Array.isArray(data)) {
        throw new Error("Expected an array of recipes, but got: " + JSON.stringify(data));
      }

      const recipes: Recipe[] = data.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
      }));

      console.log("Processed Recipes:", recipes); // Debug log
      onRecipesFetched(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch recipes. Please try again later.",
      });
      onRecipesFetched([]); // Clear recipes on error
    }
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Selected ingredients:", data.items); // Debug log
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
                  render={({ field }) => {
                    return (
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
                    );
                  }}
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
