// app/recipe/result/page.tsx
import RecipeInfo from './components/RecipeInfo';
import Instructions from './components/Instructions';

export default function RecipeDetailPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-orange-500 mb-10">Recipe Details</h1>
      
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Recipe Image, Calories, and Ingredients */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <RecipeInfo />
        </div>
        
        {/* Instructions Section */}
        <div className="lg:w-1/2">
          <Instructions />
        </div>
      </div>
    </div>
  );
}
