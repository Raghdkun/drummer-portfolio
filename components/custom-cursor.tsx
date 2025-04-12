"use client"

import { useState, useEffect, useRef } from "react"

interface CustomCursorProps {
  // We'll keep the prop for backward compatibility but make it optional
  sectionId?: string
}

export default function CustomCursor({ sectionId }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Track cursor position throughout the entire site
      setPosition({ x: e.clientX, y: e.clientY })

      // Check if we're hovering over an interactive element
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive-element") ||
        target.closest(".interactive-element")

      setIsHovering(!!isInteractive)
      setIsVisible(true)
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      // Clean up event listeners
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Apply smooth animation using requestAnimationFrame
  useEffect(() => {
    if (!glowRef.current) return

    let animationFrameId: number

    const animateCursor = () => {
      if (glowRef.current) {
        // Enhanced glow effect
        glowRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(${
          isHovering ? 3 : isClicking ? 1.5 : 2
        })`

        // Change opacity based on interaction
        glowRef.current.style.opacity = isHovering ? "0.4" : isClicking ? "0.5" : "0.25"
      }

      animationFrameId = requestAnimationFrame(animateCursor)
    }

    animationFrameId = requestAnimationFrame(animateCursor)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [position, isClicking, isHovering])

  if (!isVisible) return null

  return (
    <>
      {/* Enhanced glow effect */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          width: "100px",
          height: "100px",
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.2s ease-out, opacity 0.3s ease-out",
          marginLeft: "-50px",
          marginTop: "-50px",
          background:
            "radial-gradient(circle, rgba(225, 29, 72, 0.8) 0%, rgba(147, 51, 234, 0.4) 40%, transparent 70%)",
          filter: "blur(15px)",
          opacity: 0.25,
        }}
      />
    </>
  )
}
