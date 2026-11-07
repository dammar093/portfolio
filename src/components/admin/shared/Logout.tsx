"use client";

import useAuth from "@/hooks/useAuth";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { toast } from "sonner";
import { Loader } from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";

export function Logout() {
  const { isLoading, error, logoutUser } = useAuth();
  if (error) toast.error(error);
  return (
    <Button
      disabled={isLoading}
      variant={"default"}
      className="cursor-pointer"
      onClick={logoutUser}
    >
      Logout {isLoading ? <Loader /> : <RiLogoutCircleRLine />}
    </Button>
  );
}
