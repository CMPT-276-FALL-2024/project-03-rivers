"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface RecipeContextType {
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <RecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};
