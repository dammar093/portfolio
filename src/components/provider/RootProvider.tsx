"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "./ThemeProvider";

interface RootProviderProps {
children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
return (
<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
    <SessionProvider>
        <Provider store={store}>
            <TooltipProvider>{children}</TooltipProvider>
        </Provider>
    </SessionProvider>
</ThemeProvider>
);
};

export default RootProvider;
