'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import { ImageCard } from './components/image-card';
import { NutritionFactsCard } from './components/nutrition-card';
import { CaloriesCard } from './components/calories-card';
import { Button } from '@/components/ui/button';
import { ArrowLeftToLine, ArrowRightFromLine, HelpCircle } from 'lucide-react';
import { NutritionExplanationDialog } from './components/NutritionExplanationDialog';

function NutritionContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const recipeId = searchParams.get("id");
    const [recipeName, setRecipeName] = useState<string>("");
    const [showHelpDialog, setShowHelpDialog] = useState(false);

    useEffect(() => {
        const fetchRecipeName = async () => {
            if (!recipeId) return;
            try {
                const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch recipe information');
                }
                const data = await response.json();
                setRecipeName(data.title);
            } catch (error) {
                console.error("Failed to fetch recipe information:", error);
            }
        };

        fetchRecipeName();

        // Check if the dialog should be shown
        const hasVisitedThisSession = sessionStorage.getItem('hasVisitedNutritionPage');
        const lastVisitTimestamp = localStorage.getItem('lastVisitNutritionPage');
        const currentTime = new Date().getTime();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

        if (!hasVisitedThisSession || (lastVisitTimestamp && currentTime - parseInt(lastVisitTimestamp) > oneHour)) {
            setShowHelpDialog(true);
            sessionStorage.setItem('hasVisitedNutritionPage', 'true');
            localStorage.setItem('lastVisitNutritionPage', currentTime.toString());
        }
    }, [recipeId]);

    const handleBackClick = () => {
        router.push(`/recipe/result?id=${recipeId}`);
    };

    const handleCalendarClick = () => {
        router.push('/calendar');
    };

    if (!recipeId) return <p>No recipe ID provided</p>;

    return (
        <div className="container">
            <div className="min-h-screen p-4">
                <div className="flex justify-between items-center mb-0 relative">
                    <div className="w-full text-center">
                        <h1 className="text-3xl font-bold inline-block">
                            {recipeName ? `${recipeName} Nutrition` : 'Recipe Nutrition'}
                        </h1>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowHelpDialog(true)}
                        className="absolute right-0"
                    >
                        <HelpCircle className="h-6 w-6" />
                        <span className="sr-only">Help</span>
                    </Button>
                </div>
               
                <div className="relative w-full h-14 px-4 ">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <Button variant="secondary" className='rounded-lg' onClick={handleBackClick}>
                            <ArrowLeftToLine />
                            Back to previous page
                        </Button>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <Button variant="secondary" className='rounded-lg' onClick={handleCalendarClick}>
                            Go to calendar
                            <ArrowRightFromLine />
                        </Button>
                    </div>
                </div>
                
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
            <NutritionExplanationDialog isOpen={showHelpDialog} onClose={() => setShowHelpDialog(false)} />
        </div>
    );
}

export default function Nutrition() {
    return (
        <Suspense fallback={<p>Loading nutrition information...</p>}>
            <NutritionContent />
        </Suspense>
    );
}

