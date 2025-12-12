import React, { useEffect, useRef, useState } from "react";
import { Conversation, Message } from "@/hooks/useChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Send, MoreVertical, Trash2, ArrowLeft } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWindowProps {
  activeConversation: Conversation | null;
  messages: Message[];
  currentUserId: number | null;
  isLoading: boolean;
  onSendMessage: (content: string) => Promise<boolean>;
  onDeleteConversation: (userId: number) => Promise<boolean>;
  onBack?: () => void; // For mobile
  isOnline?: boolean;
  isTyping?: boolean;
  onTyping?: () => void;
}

export function ChatWindow({ activeConversation, messages, currentUserId, isLoading, onSendMessage, onDeleteConversation, onBack, isTyping = false, onTyping }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const prevMessagesLengthRef = useRef(messages.length);

  // Debug log to see messages updates
  useEffect(() => {
    console.log("ChatWindow messages updated:", messages.length, messages);
  }, [messages]);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [activeConversation]);

  // Scroll to bottom ONLY when new messages are added
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const success = await onSendMessage(newMessage);
    if (success) {
      setNewMessage("");
    }
    setIsSending(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (onTyping) {
      onTyping();
    }
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 text-center p-8">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-6 rounded-full mb-6">
          <Send className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a Conversation</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">Choose a contact from the list to start chatting or continue your conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
            <AvatarImage src={activeConversation.avatar} />
            <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">{activeConversation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{activeConversation.name}</h3>
            {isTyping && <p className="text-xs text-indigo-500 font-medium animate-pulse">Typing...</p>}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={() => onDeleteConversation(activeConversation.user_id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 dark:bg-black/20" ref={scrollRef}>
        <div className="space-y-6 pb-4">
          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.sender_id === currentUserId;
              const showAvatar = !isMe && (index === 0 || messages[index - 1].sender_id !== msg.sender_id);

              return (
                <motion.div key={`${msg.id}-${index}-${messages.length}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-3 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}>
                  {!isMe && (
                    <div className="w-8 flex-shrink-0">
                      {showAvatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activeConversation.avatar} />
                          <AvatarFallback className="text-xs bg-gray-200">{activeConversation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8" />
                      )}
                    </div>
                  )}

                  <div
                    className={cn(
                      "group relative px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed",
                      isMe ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700"
                    )}
                  >
                    {msg.message}
                    <span className={cn("text-[10px] block text-right mt-1 opacity-70", isMe ? "text-indigo-100" : "text-gray-400")}>{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSend} className="flex items-center gap-3 max-w-4xl mx-auto">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border-gray-200 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 rounded-full px-6 py-6"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            className={cn("h-12 w-12 rounded-full shadow-lg transition-all duration-300", newMessage.trim() ? "bg-indigo-600 hover:bg-indigo-700 scale-100" : "bg-gray-200 text-gray-400 scale-90 cursor-not-allowed dark:bg-gray-800")}
            disabled={!newMessage.trim() || isSending}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
