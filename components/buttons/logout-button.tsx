// components/buttons/logout-button.tsx
"use client";

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            // Handle error
        }
        // This forces a re-render of the current route, refreshing all Server Components
        router.refresh();
    };

    return (
        <Button onClick={handleLogout}>Logout</Button>
    );
}