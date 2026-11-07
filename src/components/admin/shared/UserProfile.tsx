import { authOptions } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getServerSession } from "next-auth";

const UserProfile = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const nameInitials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "AU";

  return (
    <Link
      href="/admin/profile"
      className="flex items-center gap-3 text-foreground"
    >
      <Avatar className="border shadow-sm border-green-600">
        <AvatarImage
          src={user?.image ?? undefined}
          alt={user?.name || "Admin User"}
        />
        <AvatarFallback>{nameInitials}</AvatarFallback>
      </Avatar>
      <span className="hidden text-sm font-medium sm:inline">
        {user?.name || "Admin User"}
      </span>
    </Link>
  );
};

export default UserProfile;
