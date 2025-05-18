"use client";

import { Message } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";
import { FileAttachment } from "./FileAttachment";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";

export function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [message.content]);
  
  // Process message content to detect code blocks
  const renderContent = () => {
    const parts = [];
    const codeBlockRegex = /```([\w]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(message.content)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: message.content.slice(lastIndex, match.index),
        });
      }
      
      // Add the code block
      parts.push({
        type: "code",
        language: match[1] || "plaintext",
        content: match[2],
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last code block
    if (lastIndex < message.content.length) {
      parts.push({
        type: "text",
        content: message.content.slice(lastIndex),
      });
    }
    
    // If no code blocks were found, just add the whole message
    if (parts.length === 0) {
      parts.push({
        type: "text",
        content: message.content,
      });
    }
    
    return parts.map((part, index) => {
      if (part.type === "code") {
        return (
          <CodeBlock
            key={index}
            language={part.language}
            value={part.content}
          />
        );
      } else {
        // Replace line breaks with <br> and # headings with actual heading elements
        const htmlContent = part.content
          .replace(/\n/g, "<br />")
          .replace(/^# (.+)$/gm, "<h1>$1</h1>")
          .replace(/^## (.+)$/gm, "<h2>$1</h2>")
          .replace(/^### (.+)$/gm, "<h3>$1</h3>");
          
        return (
          <div 
            key={index} 
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      }
    });
  };
  
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg",
        message.role === "assistant" ? "bg-muted" : ""
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
          message.role === "assistant"
            ? "bg-primary text-primary-foreground"
            : "bg-muted-foreground/10 text-muted-foreground"
        )}
      >
        {message.role === "assistant" ? (
          <Bot className="h-5 w-5" />
        ) : (
          <User className="h-5 w-5" />
        )}
      </div>
      
      {/* Message content */}
      <div className="flex-1 space-y-4">
        {renderContent()}
        
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {message.attachments.map((attachment) => (
              <FileAttachment key={attachment.id} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
      
      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}