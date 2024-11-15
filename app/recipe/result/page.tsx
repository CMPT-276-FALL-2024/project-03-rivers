// app/recipe/result/page.tsx
import RecipeInfo from './components/RecipeInfo';
import Instructions from './components/Instructions';

export default function RecipeDetailPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-10">Recipe Details</h1>
      
      {/* Recipe Info Section */}
      <div className="mb-8"> {/* Adjusted for consistent spacing */}
        <RecipeInfo />
      </div>
      
      {/* Instructions Section */}
      <div className="mb-8">
        <Instructions />
      </div>
    </div>
  );
}
