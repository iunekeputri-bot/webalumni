import { useEffect } from 'react';
import echo from '@/lib/echo';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

export const useRealtimeAlumniUpdates = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    useEffect(() => {
        // Only companies and admins should listen to this
        if (!user || (user.role !== 'company' && user.role !== 'admin')) return;

        console.log('Listening for alumni updates...');

        // Listen to public/general alumni channel or admin channel
        const channel = echo.channel('alumni-updates');

        channel.listen('AlumniProfileUpdated', (e: any) => {
            console.log('Alumni Updated:', e);

            // Invalidate alumni list queries
            queryClient.invalidateQueries({ queryKey: ['alumni'] });

            // Optionally show toast
            toast({
                title: "Profil Alumni Diperbarui",
                description: `Profil ${e.alumni.name} baru saja diperbarui.`,
            });
        });

        return () => {
            channel.stopListening('AlumniProfileUpdated');
        };
    }, [user, queryClient, toast]);
};
