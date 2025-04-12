"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, GripVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EventHighlightsManagerProps {
  highlights: string[]
  onChange: (highlights: string[]) => void
}

export default function EventHighlightsManager({ highlights = [], onChange }: EventHighlightsManagerProps) {
  const [newHighlight, setNewHighlight] = useState("")

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      const updatedHighlights = [...highlights, newHighlight.trim()]
      onChange(updatedHighlights)
      setNewHighlight("")
    }
  }

  const handleRemoveHighlight = (index: number) => {
    const updatedHighlights = highlights.filter((_, i) => i !== index)
    onChange(updatedHighlights)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddHighlight()
    }
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updatedHighlights = [...highlights]
    const temp = updatedHighlights[index]
    updatedHighlights[index] = updatedHighlights[index - 1]
    updatedHighlights[index - 1] = temp
    onChange(updatedHighlights)
  }

  const handleMoveDown = (index: number) => {
    if (index === highlights.length - 1) return
    const updatedHighlights = [...highlights]
    const temp = updatedHighlights[index]
    updatedHighlights[index] = updatedHighlights[index + 1]
    updatedHighlights[index + 1] = temp
    onChange(updatedHighlights)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a highlight point..."
            className="bg-zinc-800 border-zinc-700 flex-1"
          />
          <Button
            type="button"
            onClick={handleAddHighlight}
            disabled={!newHighlight.trim()}
            className="bg-rose-500 hover:bg-rose-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-2 mt-2">
          {highlights.length === 0 ? (
            <p className="text-zinc-500 text-sm italic">No highlights added yet.</p>
          ) : (
            highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded-md border border-zinc-700/50 group"
              >
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-zinc-400 hover:text-white disabled:opacity-30"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === highlights.length - 1}
                    className="text-zinc-400 hover:text-white disabled:opacity-30"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
                <GripVertical className="h-4 w-4 text-zinc-500" />
                <span className="flex-1 text-zinc-300">{highlight}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveHighlight(index)}
                  className="h-6 w-6 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
