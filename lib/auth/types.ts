export interface AuthUser {
  id: string;
  email?: string | null;
  displayName?: string | null;
  username?: string | null;
  avatarUrl?: string | null;
  avatarVersion?: number;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterInput extends AuthCredentials {
  displayName?: string;
  username?: string;
}
