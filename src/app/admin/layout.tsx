import { ReactNode } from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/admin/shared/AppSidebar";
import UseProfile from "@/components/admin/shared/UserProfile";
import { ModeToggle } from "@/components/theme/Mode";
import NotificationPanel from "@/components/admin/shared/NotificatonPanel";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="mx-4 flex min-w-0 w-full flex-col gap-6 px-3">
        <header className="sticky top-0 z-40 mt-5 flex items-center justify-between rounded-md border bg-background px-3 py-4 text-foreground shadow-sm">
          <SidebarTrigger />

          <div className="flex items-center gap-4">
            <NotificationPanel />
            <ModeToggle />
            <UseProfile />
          </div>
        </header>

        <div className="min-w-0 flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
