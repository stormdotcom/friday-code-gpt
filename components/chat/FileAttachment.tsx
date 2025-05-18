"use client";

import { MessageAttachment } from "@/lib/types";
import { Download, File, Image } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

type FileAttachmentProps = {
  attachment: MessageAttachment;
};

export function FileAttachment({ attachment }: FileAttachmentProps) {
  if (attachment.type === "image" && attachment.url) {
    return (
      <div className="group relative overflow-hidden rounded-md border border-border">
        <img
          src={attachment.url}
          alt={attachment.name}
          className="h-32 w-auto object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-background/80 transition-opacity group-hover:opacity-100">
          <div className="flex gap-2">
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-muted hover:bg-muted/80"
            >
              <Image className="h-4 w-4" />
              <span className="sr-only">View image</span>
            </a>
            <a
              href={attachment.url}
              download={attachment.name}
              className="p-2 rounded-full bg-muted hover:bg-muted/80"
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download image</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 p-2 rounded-md border border-border bg-card">
      <div className="p-2 rounded-md bg-muted">
        <File className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{attachment.name}</div>
        {attachment.size !== undefined && (
          <div className="text-xs text-muted-foreground">
            {formatFileSize(attachment.size)}
          </div>
        )}
      </div>
      <a
        href={attachment.url}
        download={attachment.name}
        className="p-1.5 rounded-md bg-muted hover:bg-muted/80"
      >
        <Download className="h-4 w-4" />
        <span className="sr-only">Download file</span>
      </a>
    </div>
  );
}