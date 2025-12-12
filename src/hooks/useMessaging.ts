import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { API_URL } from "@/config/api";

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: number;
    name: string;
    email: string;
  };
  receiver?: {
    id: number;
    name: string;
    email: string;
  };
}

interface Conversation {
  user_id: number;
  name: string;
  email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export function useMessaging(currentUserId: number | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const response = await fetch(`${API_URL}/conversations?_t=${new Date().getTime()}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch conversations (${response.status})`);
      }
      const data = await response.json();
      // Ensure user_id is a number
      const formattedData = data.map((c: any) => ({
        ...c,
        user_id: Number(c.user_id),
      }));
      setConversations(formattedData);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: `Gagal memuat percakapan: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  }, [currentUserId]);

  // Fetch messages between current user and selected user
  const fetchMessages = useCallback(
    async (otherUserId: number, options: { showLoading?: boolean } = { showLoading: true }) => {
      if (!currentUserId) {
        console.warn("currentUserId is not set");
        return;
      }

      // Set selected user immediately to prevent sync issues
      setSelectedUserId(Number(otherUserId));

      if (options.showLoading) {
        setIsLoading(true);
      }
      try {
        const url = `${API_URL}/messages/${currentUserId}/${otherUserId}`;
        const response = await fetch(url, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch messages (${response.status})`);
        }
        const data = await response.json();

        // Update messages
        setMessages(data);

        // Note: We removed fetchConversations() here to prevent list jumping/flickering
        // The conversation list is updated via polling or explicit actions (send/delete)
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: `Gagal memuat pesan: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        });
      } finally {
        if (options.showLoading) {
          setIsLoading(false);
        }
      }
    },
    [currentUserId]
  );

  // Send a message
  const sendMessage = useCallback(
    async (receiverId: number, messageText: string) => {
      if (!currentUserId || !messageText.trim()) {
        console.warn("Invalid send message parameters:", { currentUserId, messageText });
        return false;
      }

      try {
        const response = await fetch(`${API_URL}/messages`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            sender_id: currentUserId,
            receiver_id: receiverId,
            message: messageText,
          }),
        });

        if (response.ok) {
          // Only refresh messages for the current chat, don't refresh conversations to prevent list re-sorting
          // The polling effect will update conversations periodically
          await fetchMessages(receiverId, { showLoading: false });
        }

        return response.ok;
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: `Gagal mengirim pesan: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        });
        return false;
      }
    },
    [currentUserId, fetchMessages]
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

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to delete conversation");
        }

        // Clear messages if currently viewing this conversation
        if (selectedUserId === otherUserId) {
          setMessages([]);
          setSelectedUserId(null);
        }

        // Remove from conversations list locally
        setConversations((prev) => prev.filter((c) => c.user_id !== otherUserId));

        // Refresh conversations (to be sure)
        fetchConversations();

        toast({
          title: "Sukses",
          description: "Percakapan berhasil dihapus",
        });

        return true;
      } catch (error) {
        console.error("Error deleting conversation:", error);
        toast({
          title: "Error",
          description: `Gagal menghapus percakapan: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        });
        return false;
      }
    },
    [currentUserId, selectedUserId, fetchConversations]
  );

  // Auto-refresh conversations periodically
  useEffect(() => {
    if (!currentUserId) return;

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [currentUserId, fetchConversations]);

  // Auto-refresh messages for selected conversation
  // useEffect(() => {
  //   if (!currentUserId || !selectedUserId) return;

  //   const interval = setInterval(() => {
  //     fetchMessages(selectedUserId, { showLoading: false });
  //   }, 3000); // Refresh every 3 seconds

  //   return () => clearInterval(interval);
  // }, [currentUserId, selectedUserId, fetchMessages]);

  return {
    conversations,
    messages,
    isLoading,
    selectedUserId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    deleteConversation,
  };
}
