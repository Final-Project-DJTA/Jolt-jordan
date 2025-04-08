"use client";

import { handleLogout } from "@/app/action";
import { Button } from "@/components/ui/button";

export default function ButtonLogout() {
  return (
    <Button
      onClick={async () => {
        await handleLogout();
        Router.push("/");
      }}
      variant="outline"
      className="bg-secondary text-primary-foreground hover:bg-secondary/90"
    >
      Logout
    </Button>
  );
}
