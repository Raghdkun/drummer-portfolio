"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MessageFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  refreshMessages: () => void
}

export default function MessageFilters({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  refreshMessages,
}: MessageFiltersProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-9 bg-zinc-800 border-zinc-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400" onClick={refreshMessages}>
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
