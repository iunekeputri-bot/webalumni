import { useEffect } from 'react';
import echo from '@/lib/echo';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

export const useRealtimeNotifications = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    useEffect(() => {
        if (!user) return;

        const channel = echo.private(`App.Models.User.${user.id}`);

        channel.listen('JobApplicationStatusUpdated', (e: any) => {
            console.log('Application Status Updated:', e);

            // Invalidate applications query
            queryClient.invalidateQueries({ queryKey: ['my-applications'] });
            queryClient.invalidateQueries({ queryKey: ['company-applications'] });

            const statusMap: Record<string, string> = {
                accepted: 'Diterima',
                rejected: 'Ditolak',
                viewed: 'Dilihat',
                pending: 'Menunggu',
            };

            const statusText = statusMap[e.status] || e.status;

            toast({
                title: "Update Lamaran",
                description: `Lamaran untuk ${e.application.job_posting?.title} telah ${statusText}.`,
            });
        });

        return () => {
            channel.stopListening('JobApplicationStatusUpdated');
        };
    }, [user, queryClient, toast]);
};
