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

interface FoodItem {
  food_id: string;
  food_name: string;
  food_images?: {
    food_image: Array<{
      image_url: string;
      image_type: string;
    }>;
  };
}

interface FatSecretResponse {
  foods_search: {
    results: {
      food: FoodItem[];
    };
  };
}

export function CheckboxIngredients({ onFoodsFetched }: { onFoodsFetched: (foods: FoodItem[]) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  async function fetchFoods(ingredients: string[]) {
    try {
      const ingredientsQuery = ingredients.map(ingredient => 
        items.find(i => i.id === ingredient)?.value
      ).join(' ');
      
      if (!ingredientsQuery) throw new Error("No valid ingredients selected");
  
      // 内部APIルートを呼び出し
      const response = await fetch('/api/search-foods', {  // エンドポイントを変更
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery: ingredientsQuery })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch foods");
      }
  
      const data: FatSecretResponse = await response.json();
      console.log("API Response:", data);
  
      if (!data.foods_search?.results?.food) {
        throw new Error("No foods found");
      }
  
      const foods = Array.isArray(data.foods_search.results.food) 
        ? data.foods_search.results.food 
        : [data.foods_search.results.food]; // 単一の結果の場合も配列に変換
  
      console.log("Processed Foods:", foods);
      onFoodsFetched(foods);
    } catch (error) {
      console.error("Error fetching foods:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch foods. Please try again later.",
      });
      onFoodsFetched([]);
    }
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Selected ingredients:", data.items);
    fetchFoods(data.items);
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
                  Select the ingredients you want to search for.
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
        <Button type="submit">Search Foods</Button>
      </form>
    </Form>
  );
}