import React from "react";
import { Conversation } from "@/hooks/useChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading: boolean;
}

export function ConversationList({ conversations, activeConversation, onSelectConversation, isLoading }: ConversationListProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredConversations = conversations.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-md border-r border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-800/50">
      {/* ... existing header ... */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search conversations..." className="pl-9 bg-gray-50 border-gray-200 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {isLoading && conversations.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No conversations found</div>
          ) : (
            filteredConversations.map((conversation) => (
              <motion.button
                key={conversation.user_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onSelectConversation(conversation)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group",
                  activeConversation?.user_id === conversation.user_id ? "bg-indigo-50 dark:bg-indigo-900/20 shadow-sm" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-sm">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className={cn("text-white font-medium", activeConversation?.user_id === conversation.user_id ? "bg-indigo-500" : "bg-gray-400")}>{conversation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {conversation.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-gray-900">{conversation.unread_count}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className={cn("font-semibold truncate", activeConversation?.user_id === conversation.user_id ? "text-indigo-700 dark:text-indigo-300" : "text-gray-900 dark:text-gray-100")}>{conversation.name}</span>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{new Date(conversation.last_message_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className={cn("text-sm truncate", conversation.unread_count > 0 ? "text-gray-900 font-medium dark:text-gray-100" : "text-gray-500 dark:text-gray-400")}>{conversation.last_message}</p>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
