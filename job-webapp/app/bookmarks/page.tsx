import BookmarksList from "@/components/bookmarks/bookmarks-list"

export default function BookmarksPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-primary mb-6">Bookmarked Jobs</h1>
      <p className="text-gray-600 mb-8">View and manage your bookmarked job opportunities.</p>
      <BookmarksList />
    </div>
  )
}

