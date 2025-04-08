import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import ParticleBackground from "@/components/ui/particle-background";
import { Suspense } from "react";
import ClientAnimatedLogo from "./ClientAnimatedLogo";
import { Button } from "@/components/ui/button";
import ButtonLogout from "./ButtonLogout";

export default async function Navbar() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("Authorization")?.value;

  return (
    <header className="bg-primary text-primary-foreground relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto flex items-center justify-between py-4 relative z-10">
        <nav className="flex items-center w-full justify-between">
          <ul className="flex items-center space-x-6">
            {auth ? (
              <>
                <li>
                  <Link href="/quiz" className="hover:text-secondary transition-colors">
                    Quiz
                  </Link>
                </li>
                <li>
                  <Link href="/salary-estimation" className="hover:text-secondary transition-colors">
                    Salary Estimation
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="hover:text-secondary transition-colors">
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/" className="flex items-center gap-2">
                    <ClientAnimatedLogo />
                    <span className="text-2xl font-bold">Jolt Jordan</span>
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="hover:text-secondary transition-colors">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-secondary transition-colors">
                    Quiz
                  </Link>
                </li>
                <li>
                  <Link href="/salary-estimation" className="hover:text-secondary transition-colors">
                    Salary Estimation
                  </Link>
                </li>
              </>
            )}
          </ul>

          {auth && (
            <Link href="/" className="flex items-center gap-2">
              <ClientAnimatedLogo />
              <span className="text-2xl font-bold">Jolt Jordan</span>
            </Link>
          )}

          <ul className="flex items-center space-x-6">
            {auth ? (
              <>
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
                  <ButtonLogout />
                </li>
              </>
            ) : (
              <li>
                <Link href="/login">
                  <Button variant="outline" className="bg-secondary text-primary-foreground hover:bg-secondary/90">
                    Login
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}