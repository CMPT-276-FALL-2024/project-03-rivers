"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Suggestion {
  id: number;
  title: string;
  imageType: string;
}

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface RecipeSearchProps {
  onRecipesFetched: (recipes: Recipe[]) => void;
}

export function RecipeSearch({ onRecipesFetched }: RecipeSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Added state for selected index
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setSelectedIndex(-1); // Reset selected index when query is too short
        return;
      }

      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/autocomplete?query=${encodeURIComponent(
            query
          )}&number=5&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`
        );

        if (!response.ok) throw new Error("Failed to fetch suggestions");

        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSuggestionClick = async (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setQuery(suggestion.title);
    setShowSuggestions(false);
    await fetchRecipeById(suggestion.id);
  };

  const handleSearch = async () => {
    if (selectedIndex !== -1 && suggestions[selectedIndex]) {
      await handleSuggestionClick(suggestions[selectedIndex]);
    } else if (selectedSuggestion) {
      await fetchRecipeById(selectedSuggestion.id);
    } else if (query) {
      await searchRecipes(query);
    }
  };

  const fetchRecipeById = async (id: number) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`
      );

      if (!response.ok) throw new Error("Failed to fetch recipe");

      const recipe = await response.json();
      onRecipesFetched([{
        id: recipe.id,
        title: recipe.title,
        image: recipe.image
      }]);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  const searchRecipes = async (searchQuery: string) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
          searchQuery
        )}&number=3&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`
      );

      if (!response.ok) throw new Error("Failed to fetch recipes");

      const data = await response.json();
      onRecipesFetched(data.results);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSelectedIndex((prevIndex) =>
                Math.min(prevIndex + 1, suggestions.length - 1)
              );
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
            }
          }}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute w-full mt-1 z-50">
          <ScrollArea className="max-h-[200px]">
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    index === selectedIndex ? 'bg-accent' : 'hover:bg-accent'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {suggestion.title}
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}

