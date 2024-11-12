import * as React from "react";
import { Card } from "@/components/ui/card";


export function CaloreisCard() {
  return (
    
      <Card className="border border-gray-200 shadow-lg h-[205px]">
      <div className="p-4">
       <div className="text-lg font-medium">1 Potato (148g / 5.3oz)</div>
        <div className="text-3xl font-bold mt-2">Calories</div>
        <div className="text-sm text-gray-500  mb-2">Amount per serving</div>
        <div className="text-5xl font-semibold text-right ">110cal</div>
        <hr className="my-2 border-gray-400" />
      </div>
    </Card>    
    


  );
}