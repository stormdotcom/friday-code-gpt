"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";
import { useConversations } from "@/context/ConversationsContext";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { getConversation, setCurrentConversation } = useConversations();
  
  // Set current conversation based on URL
  useEffect(() => {
    if (pathname.startsWith("/chat/")) {
      const conversationId = pathname.split("/").pop();
      if (conversationId) {
        const conversation = getConversation(conversationId);
        if (conversation) {
          setCurrentConversation(conversation);
        }
      }
    }
  }, [pathname, getConversation, setCurrentConversation]);

  // Check if we're on mobile and close sidebar by default
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`bg-muted fixed inset-y-0 z-40 flex w-64 flex-col transition-transform duration-200 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => isMobile && setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      
      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}