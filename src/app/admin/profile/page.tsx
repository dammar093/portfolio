import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { AccountSettings } from "./_components/AccountSettings";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  return <AccountSettings name={session.user.name ?? ""} email={session.user.email ?? ""} />;
}
