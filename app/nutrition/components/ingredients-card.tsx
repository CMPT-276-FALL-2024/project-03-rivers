"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FoodItem {
  food_id: string;
  food_name: string;
  food_images?: {
    food_image: Array<{
      image_url: string;
      image_type: string;
    }>;
  };
}

export default function FoodCard({ food }: { food: FoodItem }) {
  const router = useRouter();

  const handleViewClick = () => {
    const imageUrl = getHighestQualityImage();
    const encodedImageUrl = encodeURIComponent(imageUrl);
    router.push(`/nutrition/result?id=${food.food_id}&image=${encodedImageUrl}`);
  };

  const getHighestQualityImage = () => {
    if (!food.food_images?.food_image?.length) {
      return "/placeholder-food.png";
    }

    const images = food.food_images.food_image;
    const defaultImage = images[0].image_url;
    const highQualityImage = images.find(img => img.image_type === "0");

    return highQualityImage ? highQualityImage.image_url : defaultImage;
  };

  return (
    <Card className="w-full h-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="p-0 relative aspect-[4/3]">
        <Image 
          src={getHighestQualityImage()}
          alt={food.food_name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded-t-lg"
          priority
        />
      </CardHeader>
            <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{food.food_name}</CardTitle>
                <div className="flex justify-between items-center">
                    <Button onClick={handleViewClick} size="sm">View</Button>
                </div>
            </CardContent>
        </Card>
    );
}

