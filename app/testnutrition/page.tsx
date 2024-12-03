//@/app/testnutrition/page.tsx

"use client";

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { CheckboxIngredients } from "./components/test-checkbox";
import RecipeCard from "./components/test-card";

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

export default function Recipe() {
    const [foods, setFoods] = useState<FoodItem[]>([]);

    const handleFoodsFetched = (fetchedFoods: FoodItem[]) => {
      console.log("Foods received in page component:", fetchedFoods); 
      setFoods(fetchedFoods);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-center mt-20 gap-6">
                <div className="w-full md:w-1/3">
                    <CheckboxIngredients onFoodsFetched={handleFoodsFetched} />
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
                        {foods.length === 0 ? (
                            <p className="col-span-full text-center items-center justify-center text-gray-400">
                                Select ingredients to search for foods...
                            </p>
                        ) : (
                            foods.map((food) => (
                                <RecipeCard key={food.food_id} food={food} />
                            ))
                        )}
                    </div>        
                </ScrollArea>
            </div>
        </div>
    );
}
