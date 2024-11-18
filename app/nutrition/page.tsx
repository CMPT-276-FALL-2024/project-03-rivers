"use client";
import { useEffect, useState } from "react";
import { CaloreisCard } from "./components/caloreis-card";
import { ImageCard } from "./components/image-card";
import { NutritionFactsCard } from "./components/nutrition-card";
import { useRecipeContext } from "../context/RecipeContext";

export default function Nutrition() {
    const { selectedRecipe } = useRecipeContext();
    const [nutritionData, setNutritionData] = useState(null);

    useEffect(() => {
        // selectedRecipeが存在しない場合は早期リターン
        if (!selectedRecipe || !selectedRecipe.title) {
            console.log("No selected recipe or title is undefined."); // デバッグログ
            return;
        }

        console.log("Selected recipe title:", selectedRecipe.title); // デバッグログ

        async function fetchNutritionData() {
            try {
                // URLエンコードされたクエリを使用
                const query = encodeURIComponent(selectedRecipe.title);
                const response = await fetch(`https://api.nutritionix.com/v1_1/search/${query}?results=0:1&fields=item_name,nf_calories,nf_total_fat,nf_saturated_fat,nf_cholesterol,nf_sodium,nf_total_carbohydrate,nf_dietary_fiber,nf_sugars,nf_protein&appId=YOUR_APP_ID&appKey=YOUR_APP_KEY`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Nutrition data:", data); // デバッグログ

                if (data.hits && data.hits.length > 0) {
                    setNutritionData(data.hits[0]);
                } else {
                    console.error("No nutrition data found for the selected recipe");
                    setNutritionData(null);
                }
            } catch (error) {
                console.error("Error fetching nutrition data:", error);
            }
        }

        fetchNutritionData();
    }, [selectedRecipe]);

    if (!selectedRecipe) {
        return <div className="text-center p-4"> no slect</div>;
    }

    return (
        <div className="container">
            <div className="min-h-screen p-4">
                <h1 className="text-center text-5xl font-bold mb-8 text-orange-600">
                    {selectedRecipe.title} Nutrition Facts
                </h1>

                <div className="grid grid-rows-2 grid-cols-2 gap-2 h-[800px] ">
                    <div className="row-span-1 col-span-1 ">
                        <ImageCard recipeImage={selectedRecipe.image} />
                    </div>

                    <div className="row-span-2 col-span-1 ">
                        <NutritionFactsCard nutritionData={nutritionData} />
                    </div>

                    <div className="row-span-1 col-span-1">
                        <CaloreisCard nutritionData={nutritionData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
