import { Code, FileText, MessagesSquare } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-6">ChatGPT for Coding</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center p-4 rounded-lg bg-card border border-border">
            <Code className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-medium mb-1">Code Assistance</h3>
            <p className="text-sm text-muted-foreground">Get help with syntax, debugging, and optimization</p>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-lg bg-card border border-border">
            <FileText className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-medium mb-1">Documentation</h3>
            <p className="text-sm text-muted-foreground">Generate comments and documentation for your code</p>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-lg bg-card border border-border">
            <MessagesSquare className="h-8 w-8 mb-2 text-primary" />
            <h3 className="font-medium mb-1">Explanations</h3>
            <p className="text-sm text-muted-foreground">Learn new concepts with clear explanations</p>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Start by typing a message below or create a new chat from the sidebar.
        </p>
      </div>
    </div>
  );
}