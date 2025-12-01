"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "@/utils/supabase/client";
import { normalizeAvatarUrl } from "@/lib/normalizeAvatarUrl";

/**
 * AvatarContext
 * Centralized avatar state management.
 * Keeps avatar in sync across the app (UserMenu, Dashboard, Profile, etc.)
 */

interface AvatarContextType {
  avatarUrl: string | null;
  refreshAvatar: (userId?: string) => Promise<void>;
}

const AvatarContext = createContext<AvatarContextType>({
  avatarUrl: null,
  refreshAvatar: async () => {},
});

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  /**
   * Fetch and refresh the current user's avatar.
   * - Loads avatar from Supabase `profiles` table
   * - Normalizes to full public URL
   * - Appends cache-busting query param so new uploads show instantly
   */
  const refreshAvatar = useCallback(async (userId?: string) => {
    try {
      // Get current user ID if not provided
      if (!userId) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userId = user?.id;
      }

      if (!userId) {
        console.warn("No user found when refreshing avatar.");
        setAvatarUrl("/images/default-avatar.png");
        return;
      }

      // Fetch profile from Supabase
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching avatar:", error.message);
        setAvatarUrl("/images/default-avatar.png");
        return;
      }

      // Normalize Supabase URL to full public URL
      const normalized = normalizeAvatarUrl(data?.avatar_url);

      // Add cache-busting param to force refresh after updates
      const cacheBusted = normalized ? `${normalized}?v=${Date.now()}` : null;

      setAvatarUrl(cacheBusted || "/images/default-avatar.png");
    } catch (err: any) {
      console.error("Unexpected error refreshing avatar:", err.message);
      setAvatarUrl("/images/default-avatar.png");
    }
  }, []);

  /**
   * Initialize avatar on mount.
   * Will refresh automatically on login or session change.
   */
  useEffect(() => {
    refreshAvatar();

    // Optionally, subscribe to Supabase auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await refreshAvatar(session?.user?.id);
        }
        if (event === "SIGNED_OUT") {
          setAvatarUrl("/images/default-avatar.png");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [refreshAvatar]);

  return (
    <AvatarContext.Provider value={{ avatarUrl, refreshAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
}

/**
 * Hook: useAvatar()
 * Access the global avatar URL and refresh function.
 */
export const useAvatar = () => useContext(AvatarContext);
