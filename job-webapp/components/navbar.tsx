import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import ParticleBackground from "@/components/ui/particle-background";
import ButtonLogout from "./ButtonLogout";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import ClientAnimatedLogo from "./ClientAnimatedLogo";
import ButtonAuth from "./ButtonAuth";

export default async function Navbar() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("Authorization")?.value;
  console.log(auth);

  return (
    <header className="bg-primary text-primary-foreground relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto flex items-center justify-between py-4 relative z-10">
        {/* Animasi logo dipisah sebagai Client Component */}
        <Link href="/" className="flex items-center gap-2">
          <ClientAnimatedLogo />
          <span className="text-2xl font-bold">Jolt Jordan</span>
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/" className="hover:text-secondary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/jobs"
                className="hover:text-secondary transition-colors"
              >
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
                <ButtonAuth />
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
