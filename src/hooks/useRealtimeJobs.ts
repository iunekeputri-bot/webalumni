import { useEffect } from 'react';
import echo from '@/lib/echo';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

export const useRealtimeJobs = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    useEffect(() => {
        const channel = echo.channel('jobs');

        channel.listen('JobPosted', (e: any) => {
            console.log('New Job Posted:', e.job);

            // Invalidate the jobs query to refetch
            queryClient.invalidateQueries({ queryKey: ['job-postings'] });

            // Show notification
            toast({
                title: "Lowongan Baru!",
                description: `${e.job.title} di ${e.job.company.name || 'Perusahaan'} baru saja diposting.`,
            });
        });

        return () => {
            channel.stopListening('JobPosted');
        };
    }, [queryClient, toast]);
};
