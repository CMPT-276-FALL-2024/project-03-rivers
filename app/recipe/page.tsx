"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import RecipeCard from "./components/recipe-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckboxIngredients } from "./components/ingredients-selector";
import { RecipeSearch } from "./components/searchbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

export default function Recipe() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const hasVisitedThisSession = sessionStorage.getItem('hasVisitedRecipePage');
    const lastVisitTimestamp = localStorage.getItem('lastVisitRecipePage');
    const currentTime = new Date().getTime();
    const oneMinute = 30 * 1000; // 30 seconds

    if (!hasVisitedThisSession || (lastVisitTimestamp && currentTime - parseInt(lastVisitTimestamp) > oneMinute)) {
      setShowNotice(true);
      sessionStorage.setItem('hasVisitedRecipePage', 'true');
      localStorage.setItem('lastVisitRecipePage', currentTime.toString());
    }
  }, []);

  const handleRecipesFetched = (fetchedRecipes: Recipe[]) => {
    console.log("Recipes received in page component:", fetchedRecipes);
    setRecipes(fetchedRecipes);
  };

  const dismissNotice = () => {
    setShowNotice(false);
    sessionStorage.setItem('hasVisitedRecipePage', 'true');
    localStorage.setItem('lastVisitRecipePage', new Date().getTime().toString());
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-8">
      <Dialog open={showNotice} onOpenChange={setShowNotice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Recipe Search!</DialogTitle>
            <DialogDescription>
              With this app, you can search for recipes or find recipes based on ingredients you have on hand.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="font-semibold mb-2">How to use:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Search by recipe name</li>
              <li>Or select ingredients to find recipes</li>
              <li>Click on a recipe you like to see details</li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={dismissNotice}>Got it!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1 className="text-3xl font-bold text-center mb-2 text-orange-500">Recipe Search</h1>
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 gap-6">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="mb-1">
            <RecipeSearch onRecipesFetched={handleRecipesFetched} />
            <h1 className="text-center font-extrabold text-3xl text-gray-500 p-32">OR</h1>                  
          </div>
          <div>
            <CheckboxIngredients onRecipesFetched={handleRecipesFetched} />
          </div>                
        </div>

        <Image 
          src="/images/arrow.png"
          alt="arrow image"
          width={100}
          height={68}
          className="hidden md:block"
        />

        <ScrollArea className="w-full md:w-2/3 h-[700px] rounded-md border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.length === 0 ? (
              <p className="col-span-full text-center items-center justify-center text-gray-400">Search for recipes or select ingredients...</p>
            ) : (
              recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            )}
          </div>        
        </ScrollArea>
      </div>
    </div>
  );
}

