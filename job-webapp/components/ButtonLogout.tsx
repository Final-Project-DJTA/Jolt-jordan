"use client";

import { handleLogout } from "@/app/action";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ButtonLogout() {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await handleLogout();
        router.push("/"); // redirect langsung ke halaman home
      }}
      variant="outline"
      className="bg-secondary text-primary-foreground hover:bg-secondary/90"
    >
      Logout
    </Button>
  );
}
