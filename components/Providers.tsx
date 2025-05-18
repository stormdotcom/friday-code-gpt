"use client";

import { ConversationsProvider } from "@/context/ConversationsContext";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ConversationsProvider>{children}</ConversationsProvider>
    </ThemeProvider>
  );
}