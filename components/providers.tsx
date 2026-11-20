"use client";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { useEffect } from "react";
import store from "@/store";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster position="top-center" richColors theme={resolvedTheme === "light" ? "light" : "dark"} />;
}

function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => { });
    }
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        <ThemedToaster />
        <RegisterSW />
      </ThemeProvider>
    </Provider>
  );
}
