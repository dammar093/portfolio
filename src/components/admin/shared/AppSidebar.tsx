"use client";
import { adminRoutes } from "@/app/admin/_routes";
import { Logout } from "./Logout";
import {
Sidebar,
SidebarContent,
SidebarGroup,
SidebarHeader,
SidebarMenu,
SidebarMenuButton,
SidebarMenuItem,
} from "@/components/ui/sidebar";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";


export function AppSidebar() {
const pathname = usePathname();
const isActive = (routePath: string) => {
// remove query params from routePath
const cleanRoute = routePath.split("?")[0];

// Dashboard must be exact
if (cleanRoute === "/admin/dashboard") {
return pathname === "/admin/dashboard";
}

// Exact match
if (pathname === cleanRoute) {
return true;
}

// Child routes (any depth)
return pathname.startsWith(cleanRoute + "/");
};

return (
<Sidebar className="h-dvh flex flex-col">
    {/* Header */}
    <SidebarHeader className="px-4 py-4 text-lg font-semibold h-20 shrink-0">
        {/* <h1 className="text-center text-2xl font-semibold capitalize">
            Alpine Power
        </h1> */}
        <div className="h-20 flex justify-center">
            <h1 className="text-center text-2xl font-semibold capitalize">
                Admin Panel
            </h1>
        </div>
    </SidebarHeader>

    {/* Scrollable Content */}
    <SidebarContent className="flex-1 overflow-y-auto px-2">
        <SidebarGroup>
            <SidebarMenu className="flex flex-col gap-5">
                {adminRoutes.map((route) => {
                const Icon = route.icon;
                const active = isActive(route.path);

                return (
                <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton asChild
                        className={clsx( "flex items-center  text-sm font-semibold gap-3 rounded-md px-3 py-2.5" ,
                        active ? "text-white bg-blue-500 hover:bg-blue-700 transition-all duration-300 hover:text-white" : "text-muted-foreground hover:bg-muted" , )}>
                        <Link href={route.path}>
                        <Icon className="h-8 w-8 shrink-0" />
                        <span>{route.title}</span>
                        </Link> 
                    </SidebarMenuButton>
                </SidebarMenuItem>
                );
                })}
            </SidebarMenu>
        </SidebarGroup>
    </SidebarContent>

    {/* Footer */}
    <SidebarHeader className="px-4 py-3 h-20 shrink-0">
        <Logout />
    </SidebarHeader>
</Sidebar>
);
}
