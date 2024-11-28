'use client'

import { useEffect } from 'react'

interface LoaderProps {
  color?: string
  size?: number
  speed?: number
  className?: string
}

export default function Helix({ 
  color = "orange", 
  size = 30, 
  speed = 1,
  className 
}: LoaderProps) {
  useEffect(() => {
    async function getLoader() {
      const { helix } = await import('ldrs')
      helix.register()
    }
    getLoader()
  }, [])

  return (
    <l-helix
      size={size}
      speed={speed}
      color={color}
    />
  )
}

