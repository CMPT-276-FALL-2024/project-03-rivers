'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface RecipeImage {
  image: string;
}

export function ImageCard() {
  const [recipeImage, setRecipeImage] = useState<RecipeImage | null>(null);
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");

  useEffect(() => {
    const fetchRecipeImage = async () => {
      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`);
        const data = await response.json();
        setRecipeImage({ image: data.image });
      } catch (error) {
        console.error("Failed to fetch recipe image:", error);
      }
    };

    if (recipeId) {
      fetchRecipeImage();
    }
  }, [recipeId]);

  if (!recipeImage) return <p>Loading...</p>;

  return (
    <Card className="border border-gray-200 shadow-lg h-[380px] p-0 m-0">
      <div className="relative w-full h-full">
        <Image
          src={recipeImage.image}
          alt="Recipe"
          layout="fill" 
          className="rounded-lg object-cover"
        />
      </div>
    </Card>
  );
}

