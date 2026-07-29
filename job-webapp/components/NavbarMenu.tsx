import Link from "next/link";
import { Button } from "./ui/button";
import { cookies } from "next/headers";

export default async function NavbarMenu() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("Authorization")?.value;
  return (
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
          <Link
            href="/bookmarks"
            className="hover:text-secondary transition-colors"
          >
            Bookmarks
          </Link>
        </li>
        <li>
          <Link
            href="/profile"
            className="hover:text-secondary transition-colors"
          >
            Profile
          </Link>
        </li>
        <li>
          <div className="flex space-x-4">
            {auth ? (
              <button>Logout</button>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="bg-secondary text-primary-foreground hover:bg-secondary/90"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
}
