import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold">
          JobHub
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/" className="hover:text-secondary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/jobs" className="hover:text-secondary transition-colors">
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/bookmarks" className="hover:text-secondary transition-colors">
                Bookmarks
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-secondary transition-colors">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/login">
                <Button variant="outline" className="bg-secondary text-primary-foreground hover:bg-secondary/90">
                  Login
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

