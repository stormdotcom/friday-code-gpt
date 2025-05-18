"use client";

import { useState, useRef, useCallback } from "react";
import { useConversations } from "@/context/ConversationsContext";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { MessageAttachment } from "@/lib/types";
import { v4 as uuidv4 } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export function ChatInput({ conversationId }: { conversationId: string }) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useConversations();
  
  const handleSendMessage = useCallback(() => {
    if (message.trim() || attachments.length > 0) {
      sendMessage(message.trim(), attachments);
      setMessage("");
      setAttachments([]);
    }
  }, [message, attachments, sendMessage]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // In a real app, you would upload the files to your server/storage
      // For this example, we'll just create mock attachments
      const newAttachments: MessageAttachment[] = Array.from(files).map((file) => {
        const isImage = file.type.startsWith("image/");
        
        return {
          id: uuidv4(),
          type: isImage ? "image" : "file",
          name: file.name,
          // In a real app, this would be the URL from your server
          url: isImage ? URL.createObjectURL(file) : "#",
          thumbnailUrl: isImage ? URL.createObjectURL(file) : undefined,
          size: file.size,
          mimeType: file.type,
        };
      });
      
      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  };
  
  const getCharacterCount = () => {
    return `${message.length}/3000`;
  };
  
  const isOverLimit = message.length > 3000;

  return (
    <div className="rounded-lg border border-input bg-background">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="p-3 flex flex-wrap gap-2 border-b border-input">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm"
            >
              {attachment.type === "image" && attachment.thumbnailUrl && (
                <img
                  src={attachment.thumbnailUrl}
                  alt={attachment.name}
                  className="h-5 w-5 rounded-full object-cover"
                />
              )}
              <span className="truncate max-w-[150px]">{attachment.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full"
                onClick={() => removeAttachment(attachment.id)}
              >
                <span className="sr-only">Remove</span>
                &times;
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="p-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          className="w-full resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          rows={3}
          maxLength={3000}
        />
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach files</span>
            </Button>
            <span
              className={`text-xs ${
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {getCharacterCount()}
            </span>
          </div>
          
          <Button
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleSendMessage}
            disabled={isUploading || (message.trim() === "" && attachments.length === 0) || isOverLimit}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}