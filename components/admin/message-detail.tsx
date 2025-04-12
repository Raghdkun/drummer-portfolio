"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Clock, CheckCircle, Archive, Trash2, Mail, Phone, Calendar, MessageSquare, ImageIcon } from "lucide-react"
import type { Database } from "@/types/supabase"
import ImageUpload from "./image-upload"
import ImageGallery from "./image-gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"]

interface MessageDetailProps {
  message: ContactSubmission
  onUpdateStatus: (messageId: string, status: string) => Promise<void>
  onAddNotes: (messageId: string, notes: string) => Promise<void>
  onDelete: (messageId: string) => Promise<void>
  onImageUploaded?: (imageUrl: string) => void
  onImageDeleted?: (imageUrl: string) => void
}

export default function MessageDetail({
  message,
  onUpdateStatus,
  onAddNotes,
  onDelete,
  onImageUploaded,
  onImageDeleted,
}: MessageDetailProps) {
  const [notes, setNotes] = useState(message.notes || "")
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("message")

  const handleSaveNotes = async () => {
    setIsSaving(true)
    await onAddNotes(message.id, notes)
    setIsSaving(false)
  }

  // Prepare attachments array
  const attachments = message.attachments || []

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{message.name}</CardTitle>
            <p className="text-zinc-400 text-sm mt-1">{message.email}</p>
          </div>
          <div className="flex items-center">
            {message.status === "new" && (
              <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full">New</span>
            )}
            {message.status === "in_progress" && (
              <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full">In Progress</span>
            )}
            {message.status === "completed" && (
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full">Completed</span>
            )}
            {message.status === "archived" && (
              <span className="text-xs px-2 py-1 bg-zinc-500/10 text-zinc-400 rounded-full">Archived</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center text-zinc-400">
            <Calendar className="h-4 w-4 mr-2 text-zinc-500" />
            <span>{format(new Date(message.submission_date), "MMMM d, yyyy 'at' h:mm a")}</span>
          </div>
          {message.phone && (
            <div className="flex items-center text-zinc-400">
              <Phone className="h-4 w-4 mr-2 text-zinc-500" />
              <span>{message.phone}</span>
            </div>
          )}
          {attachments.length > 0 && (
            <div className="flex items-center text-zinc-400">
              <ImageIcon className="h-4 w-4 mr-2 text-zinc-500" />
              <span>
                {attachments.length} {attachments.length === 1 ? "image" : "images"}
              </span>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="images">Images {attachments.length > 0 && `(${attachments.length})`}</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="message" className="mt-0">
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-zinc-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-zinc-300 mb-2">Message</h4>
                  <p className="text-zinc-300 whitespace-pre-line">{message.message}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="mt-0 space-y-6">
            <ImageGallery
              messageId={message.id}
              images={attachments}
              onImageDeleted={(imageUrl) => onImageDeleted?.(imageUrl)}
            />

            <div className="border-t border-zinc-800 pt-6">
              <ImageUpload messageId={message.id} onImageUploaded={(imageUrl) => onImageUploaded?.(imageUrl)} />
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <div className="space-y-3">
              <h4 className="font-medium text-zinc-300">Notes</h4>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this message..."
                className="min-h-[150px] bg-zinc-800 border-zinc-700"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={isSaving || notes === message.notes}
                className="bg-rose-500 hover:bg-rose-600"
              >
                {isSaving ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t border-zinc-800 pt-4 flex flex-wrap gap-2">
        {message.status !== "in_progress" && (
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700"
            onClick={() => onUpdateStatus(message.id, "in_progress")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Mark as In Progress
          </Button>
        )}

        {message.status !== "completed" && (
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700"
            onClick={() => onUpdateStatus(message.id, "completed")}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Completed
          </Button>
        )}

        {message.status !== "archived" && (
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700"
            onClick={() => onUpdateStatus(message.id, "archived")}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400"
          onClick={() => onDelete(message.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>

        <div className="flex-1 text-right">
          <a
            href={`mailto:${message.email}`}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-rose-400 transition-colors"
          >
            <Mail className="h-4 w-4 mr-2" />
            Reply via Email
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
