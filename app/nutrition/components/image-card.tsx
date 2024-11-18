import * as React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export function ImageCard({ recipeImage }: { recipeImage: string }) {
  return (
      <Card className="border border-gray-200 shadow-lg h-[380px] p-0 m-0">
        <div className="relative w-full h-full">
          <Image
            src={recipeImage}
            alt="Selected Recipe Image"
            layout="fill" 
            className="rounded-lg object-cover"
          />
        </div>
      </Card>
  );
}

