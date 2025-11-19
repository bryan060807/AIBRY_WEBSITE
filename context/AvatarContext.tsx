'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/utils/supabase/client';

type AvatarContextType = {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  refreshAvatar: (userId?: string) => Promise<void>; // ✅ optional param
};

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvatar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (!error && data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      } else {
        setAvatarUrl(null);
      }
    }

    fetchAvatar();

    const { data: subscription } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (sess?.user) fetchAvatar();
      else setAvatarUrl(null);
    });

    return () => subscription?.subscription.unsubscribe();
  }, []);

  // ✅ Allow refresh with or without explicit userId
  async function refreshAvatar(userId?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetId = userId || user?.id;
      if (!targetId) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', targetId)
        .single();

      if (!error && data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (err) {
      console.error('Error refreshing avatar:', err);
    }
  }

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl, refreshAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error('useAvatar must be used within an AvatarProvider');
  return ctx;
}
