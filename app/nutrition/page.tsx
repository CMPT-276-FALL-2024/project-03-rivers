import * as React from "react";
import { SearchBar } from "./components/search-command";
import { CheckboxFood } from "./components/checkbox-food";
import { ScrollCard } from "./components/scroll-card";
import Image from "next/image";

export default function NutritionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-orange-500">
          Search Ingredient and Check Nutrition!
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-20 gap-6">
        {/* Left Side - Search Bar */}

            <div className="w-full md:w-1/3">
                <div className="space-y-4">
                  <SearchBar />
                  <div className="text-center text-lg font-medium">or</div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Main Ingredient</label>
                    
                  </div>
                  <CheckboxFood />
                </div>
            </div>
            <Image 
                    src="/recipe/arrow.png"
                    alt="recipe image"
                    width={100}
                    height={68}
                    className="hidden md:block"
                />

               
                    <div className="flex flex-wrap justify-center gap-4">
                        <ScrollCard />
                    </div>     
        
        </div>
    </div>
    
  );
}
