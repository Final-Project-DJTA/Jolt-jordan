"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

type BookmarkContextType = {
  bookmarkedIds: Set<string>
  isBookmarked: (jobId: string) => boolean
  addBookmark: (jobId: string) => Promise<boolean>
  removeBookmark: (jobId: string) => Promise<boolean>
  refreshBookmarks: () => Promise<void>
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined)

export const useBookmark = () => {
  const context = useContext(BookmarkContext)
  if (!context) throw new Error("useBookmark must be used within BookmarkProvider")
  return context
}

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())

  const refreshBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmarks", { credentials: "include" })
      const data = await res.json()
      if (Array.isArray(data)) {
        const ids = new Set<string>(data.map((item: any) => item.job._id))
        setBookmarkedIds(ids)
      }
    } catch (err) {
      console.error("Failed to fetch bookmarks", err)
    }
  }

  useEffect(() => {
    refreshBookmarks()
  }, [])

  const isBookmarked = (jobId: string) => bookmarkedIds.has(jobId)

  const addBookmark = async (jobId: string) => {
    if (isBookmarked(jobId)) {
      toast.info("Already bookmarked")
      return false
    }

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.message || "Failed to add bookmark")
        return false
      }

      await refreshBookmarks()
      toast.success("Bookmark added")
      return true
    } catch (err) {
      toast.error("Failed to add bookmark")
      return false
    }
  }

  const removeBookmark = async (jobId: string) => {
    if (!isBookmarked(jobId)) return false

    try {
      const res = await fetch("/api/bookmarks", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.message || "Failed to remove bookmark")
        return false
      }

      await refreshBookmarks()
      toast.success("Bookmark removed")
      return true
    } catch (err) {
      toast.error("Failed to remove bookmark")
      return false
    }
  }

  return (
    <BookmarkContext.Provider
      value={{ bookmarkedIds, isBookmarked, addBookmark, removeBookmark, refreshBookmarks }}
    >
      {children}
    </BookmarkContext.Provider>
  )
}
