import { useEffect } from 'react';
import echo from '@/lib/echo';
import { useAuth } from '@/context/AuthContext';

export const useOnlinePresence = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        // Just join the channel to announce presence
        // We don't necessarily need to track the users list here unless we want to use it globally
        const channel = echo.join('presence-global');

        return () => {
            echo.leave('presence-global');
        };
    }, [user]);
};
