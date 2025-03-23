"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log("Searching for:", query)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="text"
        placeholder="Search for issues, alerts, or services..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-20"
      />
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Button type="submit" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
        Search
      </Button>
    </form>
  )
}

