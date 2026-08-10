"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authClient from "@/lib/auth/client";
import type { AuthCredentials, AuthState, AuthUser, RegisterInput } from "@/lib/auth/types";
import type { WebsiteProfile } from "@/lib/websiteProfile";

interface AuthContextValue extends AuthState {
  refresh: () => Promise<AuthUser | null>;
  login: (credentials: AuthCredentials) => Promise<AuthUser | null>;
  register: (input: RegisterInput) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  applyProfile: (profile: WebsiteProfile) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const user = await authClient.getCurrentUser();
      setState({ user, loading: false, error: null });
      return user;
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : "Unable to load session.",
      });
      return null;
    }
  }, []);

  const applyProfile = useCallback((profile: WebsiteProfile) => {
    setState((current) => ({
      ...current,
      user: {
        id: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        avatarVersion: profile.avatarVersion,
      },
      loading: false,
      error: null,
    }));
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("aibry-auth-changed", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("aibry-auth-changed", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      refresh,
      login: async (credentials) => {
        setState((current) => ({ ...current, loading: true, error: null }));
        try {
          const loginUser = await authClient.login(credentials);
          const user = (await authClient.getCurrentUser()) ?? loginUser;
          setState({ user, loading: false, error: null });
          return user;
        } catch (error) {
          setState({
            user: null,
            loading: false,
            error: error instanceof Error ? error.message : "Unable to sign in.",
          });
          throw error;
        }
      },
      register: async (input) => {
        setState((current) => ({ ...current, loading: true, error: null }));
        try {
          const registeredUser = await authClient.register(input);
          const user = (await authClient.getCurrentUser()) ?? registeredUser;
          setState({ user, loading: false, error: null });
          return user;
        } catch (error) {
          setState({
            user: null,
            loading: false,
            error: error instanceof Error ? error.message : "Unable to create account.",
          });
          throw error;
        }
      },
      logout: async () => {
        setState((current) => ({ ...current, loading: true, error: null }));
        await authClient.logout();
        setState({ user: null, loading: false, error: null });
      },
      applyProfile,
    }),
    [applyProfile, refresh, state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
