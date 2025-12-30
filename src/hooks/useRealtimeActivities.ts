import { useEffect } from 'react';
import echo from '@/lib/echo';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface JobApplicationStatusEvent {
    application: {
        id: number;
        status: string;
        job_posting: {
            title: string;
            company: {
                name: string;
            }
        }
    };
    status: string;
}

export const useRealtimeActivities = (userId: number | undefined, onUpdate: () => void) => {
    const { toast } = useToast();

    useEffect(() => {
        if (!userId) return;

        console.log(`Listening for activities on App.Models.User.${userId}`);

        const channel = echo.private(`App.Models.User.${userId}`);

        channel.listen('JobApplicationStatusUpdated', (e: JobApplicationStatusEvent) => {
            console.log('Activity Update Received:', e);

            // Show toast notification
            toast({
                title: "Status Lamaran Diperbarui",
                description: `Lamaran untuk ${e.application.job_posting.title} di ${e.application.job_posting.company.name} sekarang berstatus: ${e.status}`,
            });

            // Trigger update callback (to refresh list)
            onUpdate();
        });

        return () => {
            channel.stopListening('JobApplicationStatusUpdated');
        };
    }, [userId, onUpdate, toast]);
};
