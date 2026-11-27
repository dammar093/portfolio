"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import ThemeProvider from "./ThemeProvider";
import { ReactLenis } from "lenis/react";

function AppToaster() {
    const { resolvedTheme } = useTheme();
    return <Toaster position="top-right" richColors theme={resolvedTheme === "dark" ? "dark" : "light"} />;
}

interface RootProviderProps {
children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
return (
<ReactLenis root options={{ autoRaf: true, smoothWheel: true }}>
<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
    <AppToaster />
    <SessionProvider>
        <Provider store={store}>
            <TooltipProvider>{children}</TooltipProvider>
        </Provider>
    </SessionProvider>
</ThemeProvider>
</ReactLenis>
);
};

export default RootProvider;
