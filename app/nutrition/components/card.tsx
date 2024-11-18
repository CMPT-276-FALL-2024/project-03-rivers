import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function NutritionCard() {
  return (
    <Card className="w-[200px] border shadow-md">
      <CardHeader className="p-2">
        <img
          src="https://via.placeholder.com/150" // Replace with your image URL
          alt="Recipe Image"
          className="w-full h-auto rounded"
        />
      </CardHeader>
      <CardContent className="p-2 text-center">
        <CardTitle className="text-lg font-bold">Pasta</CardTitle>
        <p className="text-sm text-gray-500">666 Calories</p>
      </CardContent>
      <CardFooter className="p-2 flex justify-center">
        <Button variant="default" className="bg-black text-white">
          View
        </Button>
      </CardFooter>
    </Card>
  );
}

