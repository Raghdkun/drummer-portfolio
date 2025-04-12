"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, GripVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface FAQ {
  question: string
  answer: string
}

interface EventFAQManagerProps {
  faqs: FAQ[]
  onChange: (faqs: FAQ[]) => void
}

export default function EventFAQManager({ faqs = [], onChange }: EventFAQManagerProps) {
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddFAQ = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const updatedFAQs = [...faqs, { question: newQuestion.trim(), answer: newAnswer.trim() }]
      onChange(updatedFAQs)
      setNewQuestion("")
      setNewAnswer("")
      setIsAdding(false)
    }
  }

  const handleRemoveFAQ = (index: number) => {
    const updatedFAQs = faqs.filter((_, i) => i !== index)
    onChange(updatedFAQs)
  }

  const handleUpdateFAQ = (index: number, field: "question" | "answer", value: string) => {
    const updatedFAQs = [...faqs]
    updatedFAQs[index] = { ...updatedFAQs[index], [field]: value }
    onChange(updatedFAQs)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updatedFAQs = [...faqs]
    const temp = updatedFAQs[index]
    updatedFAQs[index] = updatedFAQs[index - 1]
    updatedFAQs[index - 1] = temp
    onChange(updatedFAQs)
  }

  const handleMoveDown = (index: number) => {
    if (index === faqs.length - 1) return
    const updatedFAQs = [...faqs]
    const temp = updatedFAQs[index]
    updatedFAQs[index] = updatedFAQs[index + 1]
    updatedFAQs[index + 1] = temp
    onChange(updatedFAQs)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4 space-y-4">
        {isAdding ? (
          <div className="space-y-4 bg-zinc-800/50 p-4 rounded-md border border-zinc-700/50">
            <div className="space-y-2">
              <Label htmlFor="new-question">Question</Label>
              <Input
                id="new-question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter a question..."
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-answer">Answer</Label>
              <Textarea
                id="new-answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Enter the answer..."
                className="bg-zinc-800 border-zinc-700 min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAdding(false)
                  setNewQuestion("")
                  setNewAnswer("")
                }}
                className="border-zinc-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddFAQ}
                disabled={!newQuestion.trim() || !newAnswer.trim()}
                className="bg-rose-500 hover:bg-rose-600"
              >
                Add FAQ
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New FAQ
          </Button>
        )}

        <div className="space-y-4 mt-2">
          {faqs.length === 0 ? (
            <p className="text-zinc-500 text-sm italic">No FAQs added yet.</p>
          ) : (
            faqs.map((faq, index) => (
              <div key={index} className="bg-zinc-800/50 p-4 rounded-md border border-zinc-700/50 space-y-3 group">
                <div className="flex items-center gap-2">
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
                      disabled={index === faqs.length - 1}
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
                  <div className="flex-1">
                    <Input
                      value={faq.question}
                      onChange={(e) => handleUpdateFAQ(index, "question", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 font-medium"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFAQ(index)}
                    className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={faq.answer}
                  onChange={(e) => handleUpdateFAQ(index, "answer", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 min-h-[80px]"
                />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
