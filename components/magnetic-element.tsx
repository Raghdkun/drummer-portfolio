"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"

interface MagneticElementProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export default function MagneticElement({ children, className = "", strength = 30 }: MagneticElementProps) {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !isHovered) return

    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()

    const x = (clientX - (left + width / 2)) / strength
    const y = (clientY - (top + height / 2)) / strength

    setPosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setPosition({ x: 0, y: 0 })
  }

  // No need for section-specific event listeners anymore

  return (
    <motion.div
      ref={ref}
      className={`${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.div>
  )
}
