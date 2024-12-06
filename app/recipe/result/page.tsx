//@/app/recipe/result/page.tsx

"use client";

import React from "react";
import { Suspense } from "react";
import RecipeDetail from "../components/RecipeDetail";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeDetailPage() {
  return (
    <Suspense fallback={<RecipeDetailSkeleton />}>
      <RecipeDetail />
    </Suspense>
  );
}

function RecipeDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-4">
      <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[110px] w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    </div>
  );
}

