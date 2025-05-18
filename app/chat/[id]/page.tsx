import { ChatThread } from "@/components/chat/ChatThread";

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatThread conversationId={params.id} />;
}