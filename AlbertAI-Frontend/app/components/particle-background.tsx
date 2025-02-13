"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  originalX: number
  originalY: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000) // Adjust density

      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: 0,
          speedY: 0,
          originalX: 0,
          originalY: 0,
        })
      }

      // Store original positions
      particlesRef.current.forEach((particle) => {
        particle.originalX = particle.x
        particle.originalY = particle.y
      })
    }

    // Animation
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#ffffff"

      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200 // Mouse influence radius

        if (distance < maxDistance) {
          // Repel particles from mouse
          const force = (maxDistance - distance) / maxDistance
          particle.speedX -= (dx / distance) * force * 0.5
          particle.speedY -= (dy / distance) * force * 0.5
        }

        // Return to original position
        const homeForce = 0.05
        particle.speedX += (particle.originalX - particle.x) * homeForce
        particle.speedY += (particle.originalY - particle.y) * homeForce

        // Apply friction
        particle.speedX *= 0.9
        particle.speedY *= 0.9

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, ((maxDistance - distance) / maxDistance) * 0.5 + 0.2)})`
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    // Touch move handler
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
      }
    }

    // Initialize
    updateSize()
    animate()

    // Event listeners
    window.addEventListener("resize", updateSize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateSize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ background: "black" }} />
}

