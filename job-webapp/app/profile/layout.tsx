import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Profile | Jolt Jordan',
  description: 'View and manage your profile'
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
