"use client";

import { useRouter } from "next/navigation";
import { PlusIcon, Trash2, Edit, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useConversations } from "@/context/ConversationsContext";
import { formatRelativeTime } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { conversations, createNewConversation, deleteConversation, renameConversation } = useConversations();
  const router = useRouter();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  
  const handleCreateNew = () => {
    const newId = createNewConversation();
    router.push(`/chat/${newId}`);
    if (onClose) onClose();
  };
  
  const handleConversationClick = (id: string) => {
    router.push(`/chat/${id}`);
    if (onClose) onClose();
  };
  
  const handleRenameClick = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedConversation(id);
    setNewTitle(currentTitle);
    setRenameDialogOpen(true);
  };
  
  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedConversation(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmRename = () => {
    if (selectedConversation && newTitle.trim()) {
      renameConversation(selectedConversation, newTitle.trim());
      setRenameDialogOpen(false);
    }
  };
  
  const confirmDelete = () => {
    if (selectedConversation) {
      deleteConversation(selectedConversation);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">ChatGPT for Coding</h1>
        </div>
        
        <Button
          variant="default"
          className="flex items-center gap-2 bg-primary/90 hover:bg-primary w-full mb-4"
          onClick={handleCreateNew}
        >
          <PlusIcon className="h-4 w-4" />
          New chat
        </Button>
        
        <div className="overflow-y-auto flex-1">
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className="flex items-center justify-between p-3 rounded-md hover:bg-muted/80 cursor-pointer group transition-colors"
              >
                <div className="truncate flex-1">
                  <div className="font-medium truncate">{conversation.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatRelativeTime(conversation.updatedAt)}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => handleRenameClick(conversation.id, conversation.title, e)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Rename</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={(e) => handleDeleteClick(conversation.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-border">
          <Button variant="outline" className="w-full flex items-center gap-2 justify-start">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
      
      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename conversation</DialogTitle>
            <DialogDescription>
              Give this conversation a new name
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Conversation name"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and all its messages.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}