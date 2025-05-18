"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useConversations } from "@/context/ConversationsContext";
import { EmptyState } from "./EmptyState";

export function ChatNewPage() {
  const { createNewConversation } = useConversations();
  const router = useRouter();
  
  // If user accesses /chat directly, create a new conversation
  useEffect(() => {
    const newId = createNewConversation();
    router.replace(`/chat/${newId}`);
  }, [createNewConversation, router]);
  
  return <EmptyState />;
}