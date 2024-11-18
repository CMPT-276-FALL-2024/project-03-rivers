// app/recipe/result/page.tsx
"use client";
import { useRouter } from 'next/router';

export default function RecipeResult() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Recipe Details</h1>
      <p>Recipe ID: {id}</p>
    </div>
  );
}
