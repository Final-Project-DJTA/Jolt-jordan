import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "./ui/button";
import ButtonLogout from "./ButtonLogout";

export default async function ButtonAuth() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("Authorization")?.value;
  console.log(auth);

  return (
    <div>
      {auth ? (
        <ButtonLogout />
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
  );
}
