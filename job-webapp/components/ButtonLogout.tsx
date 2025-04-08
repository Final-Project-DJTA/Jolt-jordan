"use client";

import { handleLogout } from "@/app/action";

export default function ButtonLogout() {
  return (
    <button
      onClick={() => {
        handleLogout();
      }}
    >
      Logout
    </button>
  );
}
