export interface AuthUser {
  id: number;
  name: string;
  nameAr?: string;
  email: string;
  role: "admin" | "reviewer" | "jury" | "poet";
  status: string;
  createdAt: string;
}

const AUTH_KEY = "aha_auth_user";
const TOKEN_KEY = "aha_auth_token";

export function getAuthUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser, token: string): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}
