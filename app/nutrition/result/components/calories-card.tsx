import * as React from "react";
import { Card } from "@/components/ui/card";


export function CaloreisCard() {
  return (
        <Card className="border border-gray-200 shadow-lg h-[205px] p-4 flex flex-col justify-center">
          <div className="text-lg font-medium mb-2">1 Potato (148g / 5.3oz)</div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-3xl font-bold">Calories</div>
              <div className="text-sm text-gray-500">Amount per serving</div>
            </div>
            <div className="text-5xl font-semibold text-gray-600">110cal</div>
          </div>
          <hr className="my-2 border-gray-400" />
        </Card>

  );
}