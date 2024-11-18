import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NutritionCard } from "./card"; // Ensure correct path

export function ScrollCard() {
  const cards = Array.from({ length: 6 }); // Example: rendering 6 cards

  return (
    <ScrollArea className="h-72 w-full rounded-md border p-4 overflow-auto">
      <div className="flex flex-wrap justify-center gap-4">
        {cards.map((_, index) => (
          <NutritionCard key={index} />
        ))}
      </div>
    </ScrollArea>
  );
}
