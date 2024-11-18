
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Recipe {
    id: number;
    image: string;
    title: string;
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    const router = useRouter();

    const handleViewClick = () => {
        router.push(`/recipe/result?id=${recipe.id}`);
    };

    return (
        <Card className="w-full shadow-md">
            <CardHeader className="p-0">
                <Image 
                    src={recipe.image}
                    alt={recipe.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            </CardHeader>
            <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{recipe.title}</CardTitle>
                <div className="flex justify-between items-center">
                    <Button onClick={handleViewClick} size="sm">View</Button>
                </div>
            </CardContent>
        </Card>
    );
}
