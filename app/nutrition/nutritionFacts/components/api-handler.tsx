'use client'

import { useState, useEffect } from 'react'

// Define types for our API response
type NutritionData = {
  food_id: string
  food_name: string
  food_image: string
  servings: {
    serving: {
      calories: string
      carbohydrate: string
      protein: string
      fat: string
      fiber: string
      sugar: string
      sodium: string
      potassium: string
      cholesterol: string
      vitamin_c: string
      calcium: string
      iron: string
      serving_size: string
    }
  }
}

export function ApiHandler({ foodId, children }: { foodId: string, children: (data: NutritionData | null, isLoading: boolean, error: Error | null) => React.ReactNode }) {
  const [data, setData] = useState<NutritionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/nutrition?foodId=${foodId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        setData(result.food)
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An unknown error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [foodId])

  return children(data, isLoading, error)
}