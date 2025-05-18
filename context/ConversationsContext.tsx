"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Conversation, Message, MessageAttachment } from "@/lib/types";
import { v4 as uuidv4 } from "@/lib/utils";
import { mockConversations } from "@/lib/mocks";
import { useToast } from "@/components/ui/use-toast";

type ConversationsContextType = {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isTyping: boolean;
  sendMessage: (content: string, attachments?: MessageAttachment[]) => void;
  createNewConversation: () => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  setCurrentConversation: (conversation: Conversation | null) => void;
};

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      try {
        setConversations(JSON.parse(savedConversations));
      } catch (error) {
        console.error("Failed to parse conversations from localStorage", error);
        setConversations(mockConversations);
      }
    } else {
      setConversations(mockConversations);
    }
  }, []);

  // Save conversations to localStorage when they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  const getConversation = useCallback(
    (id: string) => {
      return conversations.find((conv) => conv.id === id);
    },
    [conversations]
  );

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: "New conversation",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    return newConversation.id;
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
      }
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed",
      });
    },
    [currentConversation, toast]
  );

  const renameConversation = useCallback(
    (id: string, title: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id
            ? {
                ...conv,
                title,
                updatedAt: Date.now(),
              }
            : conv
        )
      );

      if (currentConversation?.id === id) {
        setCurrentConversation((prev) =>
          prev ? { ...prev, title, updatedAt: Date.now() } : null
        );
      }
    },
    [currentConversation]
  );

  const sendMessage = useCallback(
    (content: string, attachments: MessageAttachment[] = []) => {
      if (!currentConversation) return;

      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        conversationId: currentConversation.id,
        content,
        role: "user",
        createdAt: Date.now(),
        attachments,
      };

      // Update the conversation with the new message
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage],
        updatedAt: Date.now(),
      };

      // If this is the first message, update the conversation title
      let titleToUse = currentConversation.title;
      if (currentConversation.messages.length === 0 && content.trim() !== "") {
        titleToUse = content.length > 30 ? content.substring(0, 30) + "..." : content;
      }

      const finalConversation = {
        ...updatedConversation,
        title: titleToUse,
      };

      // Update the conversations state
      setConversations((prev) =>
        prev.map((conv) => (conv.id === currentConversation.id ? finalConversation : conv))
      );
      setCurrentConversation(finalConversation);

      // Simulate assistant typing
      setIsTyping(true);
      
      // Generate a mock response after a delay
      setTimeout(() => {
        const response = generateMockResponse(content);
        const assistantMessage: Message = {
          id: uuidv4(),
          conversationId: currentConversation.id,
          content: response,
          role: "assistant",
          createdAt: Date.now(),
        };

        const conversationWithResponse = {
          ...finalConversation,
          messages: [...finalConversation.messages, assistantMessage],
          updatedAt: Date.now(),
        };

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversation.id ? conversationWithResponse : conv
          )
        );
        setCurrentConversation(conversationWithResponse);
        setIsTyping(false);
      }, 2000);
    },
    [currentConversation]
  );

  const value = {
    conversations,
    currentConversation,
    isTyping,
    sendMessage,
    createNewConversation,
    deleteConversation,
    renameConversation,
    getConversation,
    setCurrentConversation,
  };

  return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
}

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error("useConversations must be used within a ConversationsProvider");
  }
  return context;
}

// Mock function to generate responses
function generateMockResponse(message: string): string {
  // Simple logic to determine the type of response
  if (message.toLowerCase().includes("react")) {
    return `React is a popular JavaScript library for building user interfaces. Here's a simple component example:

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;
\`\`\`

This creates a simple counter component with a button that increments the count when clicked.`;
  } else if (
    message.toLowerCase().includes("javascript") ||
    message.toLowerCase().includes("js") ||
    message.toLowerCase().includes("code")
  ) {
    return `Here's a JavaScript example that demonstrates async/await with error handling:

\`\`\`javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Usage
fetchData('https://api.example.com/data')
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error in main:', error));
\`\`\`

This function fetches data from a URL, handles potential errors, and returns the parsed JSON response.`;
  } else if (message.toLowerCase().includes("python")) {
    return `Here's a Python example demonstrating a simple class with inheritance:

\`\`\`python
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species
        
    def make_sound(self):
        print("Some generic animal sound")
        
    def __str__(self):
        return f"{self.name} is a {self.species}"
        
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, species="Dog")
        self.breed = breed
        
    def make_sound(self):
        print("Woof!")
        
    def __str__(self):
        return f"{self.name} is a {self.breed} dog"
        
# Create instances
generic_animal = Animal("Leo", "Lion")
dog = Dog("Buddy", "Golden Retriever")

# Test the objects
print(generic_animal)  # Leo is a Lion
generic_animal.make_sound()  # Some generic animal sound

print(dog)  # Buddy is a Golden Retriever
dog.make_sound()  # Woof!
\`\`\`

This example shows basic OOP principles in Python: class definition, inheritance, method overriding, and the use of `super()`.`;
  } else {
    return `I'm an AI assistant specialized in helping with coding questions. Feel free to ask about:

1. Programming languages like JavaScript, Python, Java, etc.
2. Frameworks and libraries such as React, Vue, Angular, Express, Django, etc.
3. Algorithms and data structures
4. Best practices and design patterns
5. Debugging help and code reviews

What programming topic would you like help with today?`;
  }
}
