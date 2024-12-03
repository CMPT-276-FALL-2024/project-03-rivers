"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface NutritionExplanationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NutritionExplanationDialog({ isOpen, onClose }: NutritionExplanationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Welcome to the Nutrition Page</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-semibold mb-2">Main Features:</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>View calorie information</li>
            <li>Check detailed nutritional facts</li>
            <li>Understand % Daily Values</li>
            <li>Compare nutrient levels</li>
          </ul>
          <div className="bg-pink-200 dark:bg-orange-400 dark:text-black p-4 rounded-md mb-4">
            <h4 className="font-semibold mb-2">Understanding % Daily Values (% DV)</h4>
            <div className="text-sm h-[300px] overflow-y-auto pr-2">
              <p>
                % Daily Value (% DV) is a guide to the nutrients in one serving of food. It shows how much a nutrient in a serving of food contributes to a total daily diet, based on a standard 2,000 calorie diet for healthy adults.
              </p>
              <p className="mt-2">
                Here's how to interpret % DV:
              </p>
              <ul className="list-disc list-inside pl-4 mt-2">
                <li>5% DV or less is considered low</li>
                <li>10% to 19% DV is considered moderate</li>
                <li>20% DV or more is considered high</li>
              </ul>
              <p className="mt-2">
                For example:
              </p>
              <ul className="list-disc list-inside pl-4 mt-2">
                <li>If a food has 25% DV for calcium, it provides 25% of the calcium you need each day.</li>
                <li>If a food has 3% DV for fiber, it's low in fiber.</li>
                <li>If a food has 30% DV for saturated fat, it's high in saturated fat.</li>
              </ul>
              <p className="mt-2">
                You can use % DV to:
              </p>
              <ul className="list-disc list-inside pl-4 mt-2">
                <li>Compare different food products</li>
                <li>Choose foods higher in nutrients you want more of (like fiber, vitamins, and minerals)</li>
                <li>Choose foods lower in nutrients you may want to limit (like saturated fat, sodium, and added sugars)</li>
              </ul>
              <p className="mt-2">
                Remember, % DV is based on a 2,000 calorie diet. Your personal daily values may be higher or lower depending on your calorie needs, which vary based on age, sex, weight, height, and level of physical activity.
              </p>
              <p className="font-semibold mt-2">
                Always consult with a healthcare professional or registered dietitian for personalized dietary advice.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Got it!</Button>
        </DialogFooter>
        <style jsx global>{`
          .text-sm::-webkit-scrollbar {
            width: 8px;
          }
          .text-sm::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .text-sm::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .text-sm::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

