import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import echo from "@/lib/echo"; // Correct path and import style
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

export const useGlobalRealtime = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user || !user.role) return;

        const role = user.role; // e.g., 'admin', 'company', 'alumni', 'super_admin'
        const channelName = `global.role.${role}`;

        console.log(`🔌 Connecting to global realtime channel: ${channelName}`);

        const channel = echo.private(channelName);

        channel.listen(".GlobalRealtimeUpdate", (event: any) => {
            console.log("⚡ Realtime Update Received:", event);

            const { type, action, data } = event;
            // type: 'job_postings', 'alumni', 'job_applications', etc.
            // action: 'create', 'update', 'delete'

            // 1. Invalidate Queries to refresh data
            // We map the type to query keys. E.g. 'job_postings' -> ['jobs']
            let queryKey: string[] = [type];

            // Mapping specific backend types to frontend query keys if they differ
            if (type === 'job_postings') queryKey = ['jobs'];
            if (type === 'alumni') queryKey = ['alumni'];
            if (type === 'job_applications') queryKey = ['applications'];
            if (type === 'documents') queryKey = ['documents'];
            if (type === 'messages') queryKey = ['messages'];

            console.log(`🔄 Invalidating query key: ${queryKey}`);
            queryClient.invalidateQueries({ queryKey });

            // Dispatch a custom window event for non-react-query components
            window.dispatchEvent(new CustomEvent('global-realtime-update', {
                detail: { type, action, data }
            }));

            // 2. Show Toast Notification (Optional but requested "chat style")
            let message = "";
            if (action === 'create') message = `New ${type} added`;
            if (action === 'update') message = `${type} updated`;
            if (action === 'delete') message = `${type} removed`;

            // Customize messages based on type
            if (type === 'job_postings' && action === 'create') message = "Lowongan baru tersedia!";
            if (type === 'job_applications' && action === 'update') message = "Status lamaran berubah!";

            toast({
                title: "Realtime Update",
                description: message,
                duration: 3000,
            });
        });

        return () => {
            console.log(`🔌 Leaving channel: ${channelName}`);
            echo.leave(channelName);
        };
    }, [user, queryClient]);
};
