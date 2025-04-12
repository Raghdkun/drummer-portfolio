"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/admin/dashboard-layout"
import { createClientSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import type { Database } from "@/types/supabase"
import MessageList from "@/components/admin/message-list"
import MessageDetail from "@/components/admin/message-detail"
import MessageFilters from "@/components/admin/message-filters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Inbox, Clock, ImageIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"]

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([])
  const [filteredMessages, setFilteredMessages] = useState<ContactSubmission[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalMessages, setTotalMessages] = useState(0)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesPerPage = 10
  const [totalAttachments, setTotalAttachments] = useState(0)

  const supabase = createClientSupabaseClient()

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("contact_submissions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact_submissions",
        },
        (payload) => {
          fetchMessages()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Fetch messages with pagination
  const fetchMessages = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get total count for pagination
      const { count, error: countError } = await supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true })

      if (countError) throw countError
      setTotalMessages(count || 0)

      // Fetch messages with pagination
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("submission_date", { ascending: false })
        .range((currentPage - 1) * messagesPerPage, currentPage * messagesPerPage - 1)

      if (error) throw error

      // Calculate total attachments
      const attachmentsCount =
        data?.reduce((acc, message) => {
          return acc + (message.attachments?.length || 0)
        }, 0) || 0

      setTotalAttachments(attachmentsCount)
      setMessages(data || [])

      // If we had a selected message, update it with fresh data
      if (selectedMessage) {
        const updatedMessage = data?.find((msg) => msg.id === selectedMessage.id)
        if (updatedMessage) {
          setSelectedMessage(updatedMessage)
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err)
      setError("Failed to load messages. Please try again.")
      toast.error("Failed to load messages")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchMessages()
  }, [currentPage])

  // Apply filters and search
  useEffect(() => {
    let filtered = [...messages]

    // Apply tab filter
    if (activeTab === "unread") {
      filtered = filtered.filter((message) => !message.is_read)
    } else if (activeTab === "inprogress") {
      filtered = filtered.filter((message) => message.status === "in_progress")
    } else if (activeTab === "archived") {
      filtered = filtered.filter((message) => message.status === "archived")
    } else if (activeTab === "with_images") {
      filtered = filtered.filter((message) => (message.attachments?.length || 0) > 0)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (message) =>
          message.name.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query),
      )
    }

    setFilteredMessages(filtered)
  }, [messages, activeTab, searchQuery])

  // Handle message selection
  const handleSelectMessage = (message: ContactSubmission) => {
    setSelectedMessage(message)

    // If message is unread, mark it as read
    if (!message.is_read) {
      markMessageAsRead(message.id)
    }
  }

  // Mark message as read
  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase.from("contact_submissions").update({ is_read: true }).eq("id", messageId)

      if (error) throw error

      // Update local state
      setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? { ...msg, is_read: true } : msg)))
    } catch (err) {
      console.error("Error marking message as read:", err)
      toast.error("Failed to mark message as read")
    }
  }

  // Update message status
  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", messageId)

      if (error) throw error

      toast.success(`Message marked as ${status.replace("_", " ")}`)

      // Update local state
      setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? { ...msg, status } : msg)))

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage((prev) => (prev ? { ...prev, status } : null))
      }
    } catch (err) {
      console.error("Error updating message status:", err)
      toast.error("Failed to update message status")
    }
  }

  // Add notes to a message
  const addMessageNotes = async (messageId: string, notes: string) => {
    try {
      const { error } = await supabase.from("contact_submissions").update({ notes }).eq("id", messageId)

      if (error) throw error

      toast.success("Notes updated successfully")

      // Update local state
      setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? { ...msg, notes } : msg)))

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage((prev) => (prev ? { ...prev, notes } : null))
      }
    } catch (err) {
      console.error("Error updating message notes:", err)
      toast.error("Failed to update notes")
    }
  }

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return
    }

    try {
      // Get the message to find attachments
      const message = messages.find((msg) => msg.id === messageId)
      const attachments = message?.attachments || []

      // Delete attachments from storage if any
      if (attachments.length > 0) {
        // Extract paths from URLs
        const paths = attachments.map((url) => {
          const urlObj = new URL(url)
          return urlObj.pathname.replace(/^\/storage\/v1\/object\/public\/message-attachments\//, "")
        })

        // Delete from storage
        await supabase.storage.from("message-attachments").remove(paths)
      }

      // Delete the message
      const { error } = await supabase.from("contact_submissions").delete().eq("id", messageId)

      if (error) throw error

      toast.success("Message deleted successfully")

      // Update local state
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId))

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null)
      }
    } catch (err) {
      console.error("Error deleting message:", err)
      toast.error("Failed to delete message")
    }
  }

  // Handle image upload
  const handleImageUploaded = async (messageId: string, imageUrl: string) => {
    try {
      // Get current message
      const message = messages.find((msg) => msg.id === messageId)
      if (!message) return

      // Update attachments array
      const currentAttachments = message.attachments || []
      const updatedAttachments = [...currentAttachments, imageUrl]

      // Update in database
      const { error } = await supabase
        .from("contact_submissions")
        .update({ attachments: updatedAttachments })
        .eq("id", messageId)

      if (error) throw error

      // Update local state
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, attachments: updatedAttachments } : msg)),
      )

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage((prev) => (prev ? { ...prev, attachments: updatedAttachments } : null))
      }

      setTotalAttachments((prev) => prev + 1)
    } catch (err) {
      console.error("Error updating message attachments:", err)
      toast.error("Failed to update message attachments")
    }
  }

  // Handle image deletion
  const handleImageDeleted = async (messageId: string, imageUrl: string) => {
    try {
      // Get current message
      const message = messages.find((msg) => msg.id === messageId)
      if (!message) return

      // Update attachments array
      const currentAttachments = message.attachments || []
      const updatedAttachments = currentAttachments.filter((url) => url !== imageUrl)

      // Update in database
      const { error } = await supabase
        .from("contact_submissions")
        .update({ attachments: updatedAttachments })
        .eq("id", messageId)

      if (error) throw error

      // Update local state
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, attachments: updatedAttachments } : msg)),
      )

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage((prev) => (prev ? { ...prev, attachments: updatedAttachments } : null))
      }

      setTotalAttachments((prev) => prev - 1)
    } catch (err) {
      console.error("Error updating message attachments:", err)
      toast.error("Failed to update message attachments")
    }
  }

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalMessages / messagesPerPage)

  // Get counts for tabs
  const unreadCount = messages.filter((msg) => !msg.is_read).length
  const inProgressCount = messages.filter((msg) => msg.status === "in_progress").length
  const archivedCount = messages.filter((msg) => msg.status === "archived").length
  const withImagesCount = messages.filter((msg) => (msg.attachments?.length || 0) > 0).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-zinc-400">Manage contact form submissions from your website visitors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Message filters and list */}
          <div className="md:col-span-1 space-y-6">
            <MessageFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              refreshMessages={fetchMessages}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  Unread{" "}
                  {unreadCount > 0 && (
                    <span className="ml-1 text-xs bg-rose-500 text-white rounded-full px-1.5 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="inprogress" className="text-xs">
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="archived" className="text-xs">
                  Archived
                </TabsTrigger>
                <TabsTrigger value="with_images" className="text-xs">
                  With Images
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <MessageList
                  messages={filteredMessages}
                  isLoading={isLoading}
                  error={error}
                  selectedMessageId={selectedMessage?.id}
                  onSelectMessage={handleSelectMessage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>

              <TabsContent value="unread" className="mt-0">
                <MessageList
                  messages={filteredMessages}
                  isLoading={isLoading}
                  error={error}
                  selectedMessageId={selectedMessage?.id}
                  onSelectMessage={handleSelectMessage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>

              <TabsContent value="inprogress" className="mt-0">
                <MessageList
                  messages={filteredMessages}
                  isLoading={isLoading}
                  error={error}
                  selectedMessageId={selectedMessage?.id}
                  onSelectMessage={handleSelectMessage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>

              <TabsContent value="archived" className="mt-0">
                <MessageList
                  messages={filteredMessages}
                  isLoading={isLoading}
                  error={error}
                  selectedMessageId={selectedMessage?.id}
                  onSelectMessage={handleSelectMessage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>

              <TabsContent value="with_images" className="mt-0">
                <MessageList
                  messages={filteredMessages}
                  isLoading={isLoading}
                  error={error}
                  selectedMessageId={selectedMessage?.id}
                  onSelectMessage={handleSelectMessage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Message detail view */}
          <div className="md:col-span-2">
            {isLoading && !selectedMessage ? (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-zinc-800" />
                  <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-32 w-full bg-zinc-800" />
                  <Skeleton className="h-10 w-full bg-zinc-800" />
                  <Skeleton className="h-10 w-full bg-zinc-800" />
                </CardContent>
              </Card>
            ) : selectedMessage ? (
              <MessageDetail
                message={selectedMessage}
                onUpdateStatus={updateMessageStatus}
                onAddNotes={addMessageNotes}
                onDelete={deleteMessage}
                onImageUploaded={(imageUrl) => handleImageUploaded(selectedMessage.id, imageUrl)}
                onImageDeleted={(imageUrl) => handleImageDeleted(selectedMessage.id, imageUrl)}
              />
            ) : (
              <Card className="bg-zinc-900 border-zinc-800 h-[400px] flex items-center justify-center">
                <CardContent className="text-center p-6">
                  <Inbox className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No message selected</h3>
                  <p className="text-zinc-400">Select a message from the list to view its details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-400 text-sm font-normal">Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Inbox className="h-8 w-8 text-rose-500 mr-4" />
                <div className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16 bg-zinc-800" /> : totalMessages}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-400 text-sm font-normal">Unread</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Inbox className="h-8 w-8 text-amber-500 mr-4" />
                <div className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16 bg-zinc-800" /> : unreadCount}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-400 text-sm font-normal">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-500 mr-4" />
                <div className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16 bg-zinc-800" /> : inProgressCount}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-400 text-sm font-normal">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ImageIcon className="h-8 w-8 text-purple-500 mr-4" />
                <div className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16 bg-zinc-800" /> : totalAttachments}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
