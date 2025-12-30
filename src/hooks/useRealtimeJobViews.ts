import { useEffect } from 'react';
import echo from '@/lib/echo';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

export const useRealtimeJobViews = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    useEffect(() => {
        if (!user || user.role !== 'company') return;

        const channel = echo.private(`App.Models.User.${user.id}`);

        channel.listen('JobViewed', (e: any) => {
            console.log('Job Viewed:', e);

            // Invalidate company jobs query to update view counts
            queryClient.invalidateQueries({ queryKey: ['job-postings'] });

            // Optionally show toast for views (might be too noisy if popular)
            // if (e.viewer) {
            //     toast({
            //         title: "Lowongan Dilihat",
            //         description: `${e.viewer.name} melihat lowongan Anda.`,
            //     });
            // }
        });

        return () => {
            channel.stopListening('JobViewed');
        };
    }, [user, queryClient, toast]);
};
