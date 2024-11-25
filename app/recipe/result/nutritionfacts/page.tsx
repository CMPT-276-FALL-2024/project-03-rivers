'use client';

import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { CaloriesCard } from "./components/caloreis-card";
import { ImageCard } from "./components/image-card";
import { NutritionFactsCard } from "./components/nutrition-card";

function NutritionContent() {
    const searchParams = useSearchParams();
    const recipeId = searchParams.get("id");

    if (!recipeId) return <p>No recipe ID provided</p>;

    return (
        <div className="container">
            <div className="min-h-screen p-4">
                <h1 className="text-center text-5xl font-bold mb-8 text-orange-600">
                Recipe Nutrition Facts
                </h1>
            
                <div className="grid grid-rows-2 grid-cols-2 gap-2 h-[800px]">
                    <div className="row-span-1 col-span-1">
                        <ImageCard />
                    </div>
                    
                    <div className="row-span-2 col-span-1">
                        <NutritionFactsCard />
                    </div>
                    
                    <div className="row-span-1 col-span-1">
                        <CaloriesCard />
                    </div>
                </div>
            </div>        
        </div>
    );
}

export default function Nutrition() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <NutritionContent />
        </Suspense>
    );
}

