import { useEffect } from 'react';
import echo from '@/lib/echo';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

export const useRealtimeCompanyApplications = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    useEffect(() => {
        if (!user || user.role !== 'company') return;

        console.log('Listening for company applications on:', `App.Models.User.${user.id}`);
        // Company listens on their own private channel
        const channel = echo.private(`App.Models.User.${user.id}`);

        channel.listen('JobApplicationSubmitted', (e: any) => {
            console.log('New Application Received:', e);

            // Invalidate company queries
            queryClient.invalidateQueries({ queryKey: ['job-postings'] });
            queryClient.invalidateQueries({ queryKey: ['company-applications'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

            toast({
                title: "Lamaran Baru Masuk!",
                description: `Seseorang baru saja melamar untuk posisi ${e.application.job_posting?.title || 'Unknown Title'}.`,
            });
        });

        return () => {
            channel.stopListening('JobApplicationSubmitted');
        };
    }, [user, queryClient, toast]);
};
