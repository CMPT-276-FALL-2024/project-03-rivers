'use client'

import { ApiHandler } from "./components/api-handler"
import { CaloriesCard } from "./components/calories-card"
import { ImageCard } from "./components/image-card"
import { NutritionFactsCard } from "./components/nutrition-card"

export default function Nutrition() {
  // This should be dynamically set based on user selection from previous page
  const selectedFoodId = "33691"  // Example food_id for potato

  return (
    <ApiHandler foodId={selectedFoodId}>
      {(data, isLoading, error) => (
        <div className="container">
          <div className="min-h-screen p-4">
            <h1 className="text-center text-5xl font-bold mb-8 text-orange-600">
              {isLoading ? "Loading..." : error ? "Error" : `${data?.food_name} Nutrition Facts`}
            </h1>

            {isLoading ? (
              <p>Loading nutrition data...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : data ? (
              <div className="grid grid-rows-2 grid-cols-2 gap-2 h-[800px]">
                <div className="row-span-1 col-span-1">
                  <ImageCard 
                    foodName={data.food_name} 
                    imageUrl={data.food_image}
                  />
                </div>
                <div className="row-span-2 col-span-1">
                  <NutritionFactsCard nutritionData={data.servings.serving} />
                </div>
                <div className="row-span-1 col-span-1">
                  <CaloriesCard 
                    foodName={data.food_name}
                    calories={data.servings.serving.calories}
                    servingSize={data.servings.serving.serving_size}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </ApiHandler>
  )
}