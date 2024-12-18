"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleCalendarIntegration } from "@/components/GoogleCalendarIntegration";
import { useFavorites } from '@/hooks/useFavorites';
import { Separator } from "@/components/ui/separator";
import Cardio from "@/components/icons/cardio";
import {
Dialog,
DialogContent,
DialogDescription,
DialogHeader,
DialogTitle,
DialogFooter,
DialogTrigger,
} from "@/components/ui/dialog";

interface RecipeDetail {
id: number;
title: string;
image: string;
instructions: string;
ingredients: { name: string; amount: string; baseAmount: number; unit: string }[];
}

export default function RecipeDetail() {
const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
const [servings, setServings] = useState(1);
const [calculatedIngredients, setCalculatedIngredients] = useState<{ name: string; amount: string }[]>([]);
const [notes, setNotes] = useState("");
const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
const [isFavorited, setIsFavorited] = useState(false);
const [showNotice, setShowNotice] = useState(false);
const [showHelpDialog, setShowHelpDialog] = useState(false); // Added state for Help Dialog
const searchParams = useSearchParams();
const recipeId = searchParams.get("id");
const router = useRouter();
const { addFavorite, removeFavorite, isFavorite } = useFavorites();

useEffect(() => {
  if (recipeId) {
    fetchRecipeDetail(recipeId);
  }
}, [recipeId]);

useEffect(() => {
  if (recipe) {
    setIsFavorited(isFavorite(recipe.id));
  }
}, [recipe, isFavorite]);

useEffect(() => {
  const hasVisitedThisSession = sessionStorage.getItem('hasVisitedRecipeDetail');
  const lastVisitTimestamp = localStorage.getItem('lastVisitRecipeDetail');
  const currentTime = new Date().getTime();
  const oneMinute = 60 * 60 * 1000; 

  if (!hasVisitedThisSession || (lastVisitTimestamp && currentTime - parseInt(lastVisitTimestamp) > oneMinute)) {
    setShowNotice(true);
    sessionStorage.setItem('hasVisitedRecipeDetail', 'true');
    localStorage.setItem('lastVisitRecipeDetail', currentTime.toString());
  }
}, []);

const fetchRecipeDetail = async (id: string) => {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`);
    const data = await response.json();
    const ingredients = data.extendedIngredients.map((ingredient: any) => ({
      name: ingredient.name,
      amount: `${ingredient.amount} ${ingredient.unit}`,
      baseAmount: ingredient.amount,
      unit: ingredient.unit,
    }));
    setRecipe({
      id: data.id,
      title: data.title,
      image: data.image,
      instructions: data.instructions,
      ingredients: ingredients,
    });
    setCalculatedIngredients(ingredients);
  } catch (error) {
    console.error("Failed to fetch recipe details:", error);
  }
};

const calculateIngredients = () => {
  if (recipe) {
    const newIngredients = recipe.ingredients.map(ingredient => {
      const amount = ingredient.baseAmount * servings;
      const formattedAmount = amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2).replace(/\.00$/, '');
      return {
        name: ingredient.name,
        amount: `${formattedAmount} ${ingredient.unit}`,
      };
    });
    setCalculatedIngredients(newIngredients);
  }
};

const handleDateSelect = (date: Date | undefined) => {
  setSelectedDate(date);
};

const handleTimeSelect = (time: string) => {
  setSelectedTime(time);
};

const handleNutritionClick = () => {
  if (recipeId) {
    router.push(`/recipe/result/nutrition?id=${recipeId}`);
  }
};

const toggleFavorite = () => {
  if (recipe) {
    if (isFavorited) {
      removeFavorite(recipe.id);
    } else {
      addFavorite({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image
      });
    }
    setIsFavorited(!isFavorited);
  }
};

const parseInstructions = (instructions: string): string[] => {
  const cleanInstructions = instructions.replace(/<\/?[^>]+(>|$)/g, "");
  
  if (cleanInstructions.match(/^\d+\./)) {
    return cleanInstructions.split(/(?=\d+\.)/).map(step => step.trim());
  }
  
  return cleanInstructions.split('.').filter(step => step.trim() !== '').map(step => step.trim() + '.');
};

const dismissNotice = () => {
  setShowNotice(false);
  sessionStorage.setItem('hasVisitedRecipeDetail', 'true');
  localStorage.setItem('lastVisitRecipeDetail', new Date().getTime().toString());
};

if (!recipe) return <div className="items-center justify-center">Loading</div> ;

const instructionSteps = parseInstructions(recipe.instructions);

const HelpContent = () => (
  <>
    <DialogHeader>
      <DialogTitle>Welcome to the Recipe Details Page!</DialogTitle>
      <DialogDescription>
        On this page, you can view detailed recipe information and plan your cooking schedule.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <h3 className="font-semibold mb-2">Main Features:</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Adjust ingredient quantities</li>
        <li>View cooking instructions</li>
        <li>Check nutritional information</li>
        <li>Add to favorites</li>
        <li>Set cooking schedule</li>
      </ul>
    </div>
    <div className="py-4">
      <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Important Notice</h3>
      <p className="text-sm  text-red-600 dark:text-red-400 text-muted-foreground">
        To add recipe events to your schedule, you need to log in to your Google account.
        By logging in, you can easily manage your cooking plans by integrating with your Google Calendar.
      </p>
    </div>
  </>
);

return (
  <div className="container mx-auto px-4 py-4 max-w-7xl">
    <Dialog open={showNotice} onOpenChange={setShowNotice}>
      <DialogContent>
        <HelpContent />
        <DialogFooter>
          <Button onClick={dismissNotice}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <div className="flex items-center justify-between mb-4">
      <div className="w-10"></div> {/* Spacer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <h1 className="text-2xl font-bold text-center">{recipe.title}</h1>
      </div>
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}> {/* Updated Help Dialog */}
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon"> {/* Updated button variant */}
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <HelpContent />
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>Got it!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <Image 
              src={recipe.image} 
              alt={recipe.title} 
              width={600} 
              height={400} 
              className="w-full h-auto object-cover rounded-md" 
              layout="responsive"
            />
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="h-[280px]">
            <CardContent className="p-4">
              <CardHeader className="px-0 pt-0 pb-2">
                <CardTitle className="text-lg mb-2">Ingredients</CardTitle>
              </CardHeader>
              <ScrollArea className="h-[200px] pr-4">
                {calculatedIngredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Checkbox id={`ingredient-${index}`} />
                    <label
                      htmlFor={`ingredient-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {ingredient.name}: {ingredient.amount}
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="h-[280px]">
            <CardContent className="p-4 flex flex-col justify-between">
              <div>
                <CardHeader className="px-0 pt-0 pb-2">
                  <CardTitle className="text-lg mb-1">Number of People</CardTitle>
                </CardHeader>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    min={1}
                    className="w-20"
                  />
                  <Button onClick={calculateIngredients}>Calculate</Button>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <CardHeader className="px-0 pt-0 pb-2">
                  <CardTitle className="text-lg mb-1">Nutrition Facts</CardTitle>
                </CardHeader>
                <Button className="w-full" onClick={handleNutritionClick}>
                  Go to Nutrition Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <CardHeader className="px-0 pt-0 pb-2">
              <CardTitle className="text-lg mb-2">Instructions</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[310px] pr-4">
              <ol className="list-decimal list-inside space-y-4">
                {instructionSteps.map((step, index) => (
                  <li key={index} className="text-sm">{step}</li>
                ))}
              </ol>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="h-[314px]">
          <CardContent className="p-4">
            <CardHeader className="px-0 pt-0 pb-2">
              <CardTitle className="text-lg mb-2">Note & Schedule</CardTitle>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-2 h-[230px]">
              <div className="h-full">
                <Textarea
                  placeholder="Add note..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-full resize-none"
                />
              </div>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: enUS }) : <span>Pick Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Select onValueChange={handleTimeSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pick Time">
                      {selectedTime ? (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {selectedTime}
                        </div>
                      ) : (
                        <span>Pick Time</span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                        {`${hour.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <GoogleCalendarIntegration
                  recipeTitle={recipe.title}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  notes={notes}
                  ingredients={calculatedIngredients}
                  instructions={recipe.instructions}
                  recipeId={recipe.id}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
}

