import Image from "next/image";
import RecipeCard from "./components/recipe-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectFruits } from "./components/cuisine-selector";


export default function Home() {
    return (
        <div className="">
            <div className="flex items-center justify-center mt-20 gap-6">
                <SelectFruits />
                <Image 
                    src="/recipe/arrow.png"
                    alt="recipe image"
                    width={177}
                    height={121}
                    className="rounded-t-lg"
                />
                <ScrollArea className="w-[700px] h-[700px] rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-1">
                        <RecipeCard />            
                        <RecipeCard />            
                        <RecipeCard />            
                        <RecipeCard />            
                        <RecipeCard />            
                        <RecipeCard />            
                        <RecipeCard />            
                        <RecipeCard />            
                        <RecipeCard />            
                    </div>        
                </ScrollArea>

            </div>

        </div>

    );
}
