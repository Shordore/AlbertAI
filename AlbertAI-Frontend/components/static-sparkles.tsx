"use client"

import { SparklesCore } from "./sparkles-core"

interface StaticSparklesProps {
  id?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  className?: string
  particleColor?: string
}

export function StaticSparkles({
  id = "static-sparkles",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 100,
  className = "h-full w-full",
  particleColor = "#FFFFFF",
}: StaticSparklesProps) {
  // Override the useMousePosition hook's behavior by providing a fixed position
  // This will make particles move as if the mouse is always at the center
  if (typeof window !== "undefined") {
    window.addEventListener(
      "mousemove",
      (e) => {
        // Prevent the actual mouse position from affecting the particles
        e.stopPropagation()
      },
      true,
    )
  }

  return (
    <SparklesCore
      id={id}
      background={background}
      minSize={minSize}
      maxSize={maxSize}
      particleDensity={particleDensity}
      className={className}
      particleColor={particleColor}
    />
  )
}

