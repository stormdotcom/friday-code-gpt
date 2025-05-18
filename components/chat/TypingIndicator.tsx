"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted animate-in fade-in">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex h-6 items-center">
        <span className="text-sm text-muted-foreground">
          ChatGPT is thinking{dots}
        </span>
      </div>
    </div>
  );
}