"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  language: string;
  value: string;
};

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  
  const copyToClipboard = async () => {
    if (!preRef.current) return;
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  
  // Set syntax highlighting class based on language
  const getLanguageClass = () => {
    const supportedLanguages = [
      "javascript", "js", "typescript", "ts", "jsx", "tsx",
      "python", "py", "java", "c", "cpp", "cs", "go", "rust",
      "swift", "kotlin", "php", "ruby", "html", "css", "json",
      "yaml", "markdown", "md", "bash", "shell", "sql"
    ];
    
    const normalizedLang = language.toLowerCase();
    
    if (normalizedLang === "") return "language-plaintext";
    if (supportedLanguages.includes(normalizedLang)) {
      // Map some language aliases
      if (normalizedLang === "js") return "language-javascript";
      if (normalizedLang === "ts") return "language-typescript";
      if (normalizedLang === "py") return "language-python";
      if (normalizedLang === "md") return "language-markdown";
      
      return `language-${normalizedLang}`;
    }
    
    return "language-plaintext";
  };
  
  return (
    <div className="relative group rounded-md">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy code</span>
        </button>
      </div>
      <div className="relative">
        {language && (
          <div className="absolute top-0 right-0 px-2 py-1 text-xs text-muted-foreground rounded-bl bg-muted/50">
            {language}
          </div>
        )}
        <pre
          ref={preRef}
          className={`${getLanguageClass()} p-4 rounded-md bg-muted/50 overflow-x-auto text-sm`}
        >
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}