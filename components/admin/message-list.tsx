"use client"

import { format } from "date-fns"
import { Mail, AlertCircle, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Database } from "@/types/supabase"

type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"]

interface MessageListProps {
  messages: ContactSubmission[]
  isLoading: boolean
  error: string | null
  selectedMessageId: string | undefined
  onSelectMessage: (message: ContactSubmission) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function MessageList({
  messages,
  isLoading,
  error,
  selectedMessageId,
  onSelectMessage,
  currentPage,
  totalPages,
  onPageChange,
}: MessageListProps) {
  if (isLoading && messages.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3 bg-zinc-800" />
                  <Skeleton className="h-3 w-1/2 bg-zinc-800" />
                  <Skeleton className="h-3 w-full bg-zinc-800" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Messages</h3>
          <p className="text-zinc-400 mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="border-zinc-700">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (messages.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6 text-center">
          <Mail className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Messages Found</h3>
          <p className="text-zinc-400">There are no messages matching your current filters.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`bg-zinc-900 border-zinc-800 cursor-pointer transition-colors hover:bg-zinc-800/50 ${
              selectedMessageId === message.id ? "border-rose-500/50 bg-zinc-800/50" : ""
            }`}
            onClick={() => onSelectMessage(message)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                    !message.is_read ? "bg-rose-500" : "bg-transparent"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-medium truncate ${!message.is_read ? "text-white" : "text-zinc-300"}`}>
                      {message.name}
                    </h4>
                    <span className="text-xs text-zinc-500 ml-2 whitespace-nowrap">
                      {format(new Date(message.submission_date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{message.email}</p>
                  <p className="text-sm text-zinc-300 line-clamp-2 mt-1">{message.message}</p>

                  <div className="flex items-center mt-2 gap-2">
                    {message.status === "new" && (
                      <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full">New</span>
                    )}
                    {message.status === "in_progress" && (
                      <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full">
                        In Progress
                      </span>
                    )}
                    {message.status === "completed" && (
                      <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full">Completed</span>
                    )}
                    {message.status === "archived" && (
                      <span className="text-xs px-2 py-0.5 bg-zinc-500/10 text-zinc-400 rounded-full">Archived</span>
                    )}

                    {message.attachments && message.attachments.length > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full flex items-center">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        {message.attachments.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-zinc-700"
            >
              <span className="sr-only">Previous Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <span className="text-sm text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-zinc-700"
            >
              <span className="sr-only">Next Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
