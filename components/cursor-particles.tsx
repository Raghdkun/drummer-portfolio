"use client"

import { useState, useEffect, useRef } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  life: number
  maxLife: number
  color: string
}

export default function CursorParticles({ sectionId }: { sectionId?: string }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const particleIdRef = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsActive(true)

      // Create particles more frequently
      if (Math.random() > 0.6) {
        createParticle(e.clientX, e.clientY)
      }
    }

    const handleMouseLeave = () => {
      setIsActive(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const createParticle = (x: number, y: number) => {
    // Randomly choose between rose and purple colors
    const colors = [
      "rgba(225, 29, 72, 0.8)", // Rose
      "rgba(147, 51, 234, 0.8)", // Purple
      "rgba(236, 72, 153, 0.8)", // Pink
    ]

    const newParticle: Particle = {
      id: particleIdRef.current++,
      x,
      y,
      size: Math.random() * 8 + 4, // Larger size
      life: 0,
      maxLife: Math.random() * 30 + 15, // Longer life
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setParticles((prev) => [...prev, newParticle])
  }

  const updateParticles = (time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(updateParticles)
      return
    }

    const deltaTime = time - previousTimeRef.current
    previousTimeRef.current = time

    setParticles((prev) =>
      prev
        .map((p) => ({
          ...p,
          life: p.life + deltaTime / 16, // Normalize to ~60fps
        }))
        .filter((p) => p.life < p.maxLife),
    )

    requestRef.current = requestAnimationFrame(updateParticles)
  }

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(updateParticles)
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <>
      {particles.map((particle) => {
        const progress = particle.life / particle.maxLife
        const opacity = 1 - progress
        const scale = 1 - progress * 0.7 // Slower scaling for longer visible effect

        return (
          <div
            key={particle.id}
            className="fixed pointer-events-none z-[9996]"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale})`,
              background: particle.color,
              borderRadius: "50%",
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color.replace("0.8", "0.5")}`,
              filter: "blur(1px)",
            }}
          />
        )
      })}
    </>
  )
}
