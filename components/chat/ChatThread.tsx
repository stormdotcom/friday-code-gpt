"use client";

import { useEffect, useRef } from "react";
import { useConversations } from "@/context/ConversationsContext";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { EmptyState } from "./EmptyState";
import { useRouter } from "next/navigation";
import { TypingIndicator } from "./TypingIndicator";

export function ChatThread({ conversationId }: { conversationId: string }) {
  const { getConversation, isTyping, setCurrentConversation } = useConversations();
  const conversation = getConversation(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Scroll to bottom when messages change or when typing status changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages, isTyping]);
  
  // Set current conversation when component mounts
  useEffect(() => {
    if (conversation) {
      setCurrentConversation(conversation);
    } else {
      // If conversation not found, redirect to new chat
      router.replace("/chat");
    }
  }, [conversation, setCurrentConversation, router]);
  
  if (!conversation) {
    return <EmptyState />;
  }
  
  return (
    <div className="flex flex-col h-screen">
      {/* Chat header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-medium truncate">{conversation.title}</h2>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        {conversation.messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {conversation.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="border-t border-border p-4">
        <ChatInput conversationId={conversationId} />
      </div>
    </div>
  );
}