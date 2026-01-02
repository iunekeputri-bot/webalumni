import React, { useState, useEffect } from "react";
import { useChat, Conversation } from "@/hooks/useChat";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { cn } from "@/lib/utils";

interface Alumni {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ChatLayoutProps {
  currentUserId: number | null;
  selectedAlumni?: Alumni | null;
}

export function ChatLayout({ currentUserId, selectedAlumni }: ChatLayoutProps) {
  const { conversations, messages, activeConversation, setActiveConversation, isLoadingConversations, isLoadingMessages, sendMessage, deleteConversation, onlineUsers } = useChat(currentUserId);

  // Hardcoded values since presence is disabled - REPLACED
  // const onlineUsers: number[] = [];
  const typingUsers: Record<number, boolean> = {};
  const sendTyping = (_userId: number) => { };

  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Handle responsive view
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-select alumni conversation or create mock conversation when selectedAlumni changes
  useEffect(() => {
    if (selectedAlumni) {
      const alumniConversation = conversations.find((conv: Conversation) => conv.user_id === parseInt(selectedAlumni.id));
      if (alumniConversation) {
        setActiveConversation(alumniConversation);
      } else {
        // Create a mock conversation object for the selected alumni
        const mockConversation: Conversation = {
          user_id: parseInt(selectedAlumni.id),
          name: selectedAlumni.name,
          email: selectedAlumni.email,
          avatar: selectedAlumni.avatar || `https://avatar.vercel.sh/${selectedAlumni.name.replace(/\s+/g, "")}`,
          last_message: selectedAlumni.name,
          last_message_time: new Date().toISOString(),
          unread_count: 0,
        };
        setActiveConversation(mockConversation);
      }
      if (isMobileView) {
        setShowMobileChat(true);
      }
    }
  }, [selectedAlumni, conversations, isMobileView, setActiveConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    if (isMobileView) {
      setShowMobileChat(true);
    }
  };

  const handleBackToConversations = () => {
    setShowMobileChat(false);
    setActiveConversation(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 m-4">
      {/* Sidebar / Conversation List */}
      <div className={cn("w-full md:w-80 lg:w-96 flex-shrink-0 transition-all duration-300 ease-in-out", isMobileView && showMobileChat ? "hidden" : "block")}>
        <ConversationList conversations={conversations} activeConversation={activeConversation} onSelectConversation={handleSelectConversation} isLoading={isLoadingConversations} />
      </div>

      {/* Main Chat Window */}
      <div className={cn("flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900", isMobileView && !showMobileChat ? "hidden" : "flex")}>
        <ChatWindow
          activeConversation={activeConversation}
          messages={messages}
          currentUserId={currentUserId}
          isLoading={isLoadingMessages}
          onSendMessage={async (content: string) => {
            if (activeConversation) {
              return await sendMessage(activeConversation.user_id, content);
            }
            return false;
          }}
          onDeleteConversation={deleteConversation}
          onBack={isMobileView ? handleBackToConversations : undefined}
          isTyping={activeConversation ? typingUsers[activeConversation.user_id] : false}
          onTyping={() => {
            if (activeConversation) {
              sendTyping(activeConversation.user_id);
            }
          }}
          isOnline={activeConversation ? onlineUsers.includes(activeConversation.user_id) : false}
        />
      </div>
    </div>
  );
}
