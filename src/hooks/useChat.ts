import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import echo, { updateEchoToken } from "@/lib/echo";
import { API_URL } from "@/config/api";

export interface Message {
  id: number | string; // string for temp optimistic messages
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  receiver?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Conversation {
  user_id: number;
  name: string;
  email: string;
  avatar?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export function useChat(currentUserId: number | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagePollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messageChannelRef = useRef<any>(null);
  const activeConversationRef = useRef<Conversation | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch all conversations
  const fetchConversations = useCallback(
    async (showLoading = false) => {
      if (!currentUserId) return;

      if (showLoading) setIsLoadingConversations(true);
      try {
        const response = await fetch(`${API_URL}/conversations?_t=${Date.now()}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch conversations");

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Invalid conversations format:", data);
          setConversations([]);
          return;
        }

        // Ensure user_id is number
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedData = data.map((c: any) => ({
          ...c,
          user_id: Number(c.user_id),
        }));

        setConversations((prev) => {
          // Only update if different to avoid re-renders?
          // For now, just update. In a real app, deep compare.
          return formattedData;
        });
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        if (showLoading) setIsLoadingConversations(false);
      }
    },
    [currentUserId]
  );

  // Fetch messages for a specific user
  const fetchMessages = useCallback(
    async (otherUserId: number, showLoading = true) => {
      if (!currentUserId) return;

      if (showLoading) setIsLoadingMessages(true);
      try {
        const response = await fetch(`${API_URL}/messages/${currentUserId}/${otherUserId}?_t=${Date.now()}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 404) {
            setMessages([]);
            return;
          }
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();

        // Always update messages - compare by length and last ID
        setMessages((prev) => {
          // Filter out temp/optimistic messages from prev
          const realPrev = prev.filter((m) => !String(m.id).startsWith("temp-"));

          // If data is empty, return empty
          if (!data || data.length === 0) {
            return realPrev.length === 0 ? [] : realPrev;
          }

          // If lengths differ or last message ID differs, use new data
          const lastPrevId = realPrev[realPrev.length - 1]?.id;
          const lastNewId = data[data.length - 1]?.id;

          if (data.length !== realPrev.length || lastNewId !== lastPrevId) {
            console.log(`Messages updated: ${realPrev.length} -> ${data.length}`);
            return data;
          }

          return prev; // No change
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        if (showLoading) setIsLoadingMessages(false);
      }
    },
    [currentUserId]
  );

  // Send a message
  const sendMessage = useCallback(
    async (receiverId: number, content: string) => {
      if (!currentUserId || !content.trim()) return false;

      // Create optimistic message to show immediately
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        sender_id: currentUserId,
        receiver_id: receiverId,
        message: content,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      // Show message immediately (optimistic update)
      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const headers: any = getAuthHeaders();

        // Add socket ID to headers to prevent echo and backend crash
        if (echo && echo.socketId()) {
          headers["X-Socket-ID"] = echo.socketId();
        }

        const response = await fetch(`${API_URL}/messages`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            receiver_id: receiverId,
            message: content,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Server error:", errorData);
          // Remove optimistic message on error
          setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
          throw new Error("Failed to send message");
        }

        const newMessage = await response.json();
        console.log("Message sent successfully:", newMessage);

        // Replace optimistic message with real one from server
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== optimisticMessage.id);
          return [...filtered, { ...newMessage, id: newMessage.id || optimisticMessage.id }];
        });

        // Update conversation list to show new last message
        fetchConversations();

        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Gagal mengirim pesan",
          variant: "destructive",
        });
        return false;
      }
    },
    [currentUserId, fetchConversations]
  );

  // Delete conversation
  const deleteConversation = useCallback(
    async (otherUserId: number) => {
      if (!currentUserId) return false;

      try {
        const response = await fetch(`${API_URL}/messages/${currentUserId}/${otherUserId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error("Failed to delete conversation");

        setConversations((prev) => prev.filter((c) => c.user_id !== otherUserId));
        if (activeConversation?.user_id === otherUserId) {
          setActiveConversation(null);
          setMessages([]);
        }

        toast({
          title: "Sukses",
          description: "Percakapan dihapus",
        });
        return true;
      } catch (error) {
        console.error("Error deleting conversation:", error);
        toast({
          title: "Error",
          description: "Gagal menghapus percakapan",
          variant: "destructive",
        });
        return false;
      }
    },
    [currentUserId, activeConversation]
  );

  // Setup WebSocket listeners for conversations
  useEffect(() => {
    if (!currentUserId) return;

    fetchConversations(true);

    // Subscribe to conversation updates via WebSocket
    try {
      if (channelRef.current) {
        try {
          if (typeof channelRef.current.stopListening === "function") {
            channelRef.current.stopListening();
          }
        } catch (e) {
          console.warn("Safe pre-cleanup conversation channel:", e);
        }
      }

      // Update token before subscribing
      const token = localStorage.getItem("token");
      if (token) {
        updateEchoToken(token);
      }

      channelRef.current = echo.private(`conversations.${currentUserId}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      channelRef.current.listen("conversation.updated", (data: any) => {
        console.log("Conversation updated:", data);
        setConversations((prev) => {
          const existing = prev.findIndex((c) => c.user_id === data.user_id);
          if (existing !== -1) {
            const updated = [...prev];
            updated[existing] = data;
            // Sort by last_message_time descending
            return updated.sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime());
          }
          return [data, ...prev];
        });
      });

    } catch (error) {
      console.error("WebSocket connection error:", error);
    }

    return () => {
      // if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (channelRef.current) {
        try {
          if (typeof channelRef.current.stopListening === "function") {
            channelRef.current.stopListening("conversation.updated");
          }
          // Leave the channel properly
          if (echo && typeof echo.leave === "function") {
            echo.leave(`conversations.${currentUserId}`);
          }
        } catch (error) {
          console.warn("Safe cleanup - conversation listener:", error);
        }
        channelRef.current = null;
      }
    };
  }, [currentUserId, fetchConversations]);

  // Setup WebSocket listeners for messages
  useEffect(() => {
    if (!currentUserId || !activeConversation) {
      setMessages([]);
      return;
    }

    // Initial fetch for the active conversation - only once when conversation changes
    const loadMessages = async () => {
      await fetchMessages(activeConversation.user_id, true);
    };
    loadMessages();

    // Subscribe to message updates via WebSocket
    try {
      if (messageChannelRef.current) {
        try {
          if (typeof messageChannelRef.current.stopListening === "function") {
            messageChannelRef.current.stopListening();
          }
        } catch (e) {
          console.warn("Safe pre-cleanup message channel:", e);
        }
      }

      // Update token before subscribing
      const token = localStorage.getItem("token");
      if (token) {
        updateEchoToken(token);
      }

      messageChannelRef.current = echo.private(`chat.${currentUserId}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messageChannelRef.current.listen("message.sent", (data: any) => {
        console.log("WebSocket message.sent event received:", data);

        const currentActiveConvo = activeConversationRef.current;

        // Add message if it's from the person we're chatting with
        if (currentActiveConvo && data.sender_id === currentActiveConvo.user_id) {
          setMessages((prev) => {
            // Check if message already exists by ID or by content+time
            const exists = prev.some((msg) => {
              if (msg.id && data.id) return msg.id === data.id;
              // Fallback check by content and sender
              return msg.sender_id === data.sender_id && msg.message === data.message && msg.receiver_id === data.receiver_id;
            });
            if (exists) {
              console.log("Message already in list, skipping");
              return prev;
            }
            console.log("Adding message from WebSocket to UI");
            return [...prev, data];
          });
        }
      });

    } catch (error) {
      console.error("WebSocket message connection error:", error);
    }

    return () => {
      // if (messagePollingIntervalRef.current) clearInterval(messagePollingIntervalRef.current);
      if (messageChannelRef.current) {
        try {
          if (typeof messageChannelRef.current.stopListening === "function") {
            messageChannelRef.current.stopListening("message.sent");
          }
          // Leave the channel properly
          if (echo && typeof echo.leave === "function") {
            echo.leave(`chat.${currentUserId}`);
          }
        } catch (error) {
          console.warn("Safe cleanup - message listener:", error);
        }
        messageChannelRef.current = null;
      }
    };
  }, [currentUserId, activeConversation]);

  return {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    isLoadingConversations,
    isLoadingMessages,
    sendMessage,
    deleteConversation,
    refreshConversations: () => fetchConversations(false),
  };
}
