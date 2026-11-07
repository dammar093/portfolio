import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/shared/AppSidebar";
import UseProfile from "@/components/admin/shared/UserProfile";
import { ModeToggle } from "@/components/theme/Mode";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="mx-4 flex w-full flex-col gap-10 px-3">
        <header className="mt-5 flex items-center justify-between rounded-md border bg-background px-3 py-4 text-foreground shadow-sm">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UseProfile />
          </div>
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
