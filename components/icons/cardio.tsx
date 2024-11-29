'use client'

import { useEffect } from 'react'

interface LoaderProps {
  color?: string
  size?: number
  speed?: number
  className?: string
}

export default function Cardio({ 
  color = "orange", 
  size = 30, 
  speed = 2.5,
  className 
}: LoaderProps) {
  useEffect(() => {
    async function getLoader() {
      const { cardio } = await import('ldrs')
      cardio.register()
    }
    getLoader()
  }, [])

  return (
    <l-cardio
      size={size}
      speed={speed}
      color={color}
    />
  )
}
