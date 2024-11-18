import * as React from "react";
import { Card } from "@/components/ui/card";

export function CaloreisCard({ nutritionData }: { nutritionData: any }) {
  if (!nutritionData) {
    return <div>Loading...</div>;
  }

  // Fallback to use nutritionData directly if fields are not available
  const fields = nutritionData.fields || nutritionData;

  return (
    <Card className="border border-gray-200 shadow-lg h-[205px] p-4 flex flex-col justify-center">
      <div className="text-lg font-medium mb-2">{fields.item_name || "N/A"}</div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-3xl font-bold">Calories</div>
          <div className="text-sm text-gray-500">Amount per serving</div>
        </div>
        <div className="text-5xl font-semibold text-gray-600">{fields.nf_calories || 0} cal</div>
      </div>
      <hr className="my-2 border-gray-400" />
    </Card>
  );
}
