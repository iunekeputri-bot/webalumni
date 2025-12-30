import { useEffect } from 'react';
import echo from '@/lib/echo';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

export const useRealtimeAdminUpdates = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    useEffect(() => {
        if (!user || user.role !== 'admin') return;

        const channel = echo.private('admin-updates');

        channel.listen('UserRegistered', (e: any) => {
            console.log('New User Registered:', e);
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });

            toast({
                title: "User Baru!",
                description: `${e.user.name} baru saja mendaftar sebagai ${e.user.role}.`,
            });
        });

        return () => {
            channel.stopListening('UserRegistered');
        };
    }, [user, queryClient, toast]);
};
