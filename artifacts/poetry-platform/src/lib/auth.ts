export type UserRole =
  | "sysadmin"      // System Administrator
  | "sultan"        // Dr. Sultan (final decision authority)
  | "reviewer"      // Application Reviewer
  | "jury"          // Jury Member
  | "audit"         // Audit User (Read Only)
  | "system_administrator" // alias
  | "dr_sultan" // alias
  | "application_reviewer" // alias
  | "jury_member" // alias
  | "audit_user" // alias
  | "admin"         // legacy alias for sysadmin
  | "poet";         // public submitter

export interface AuthUser {
  id: number;
  name: string;
  nameAr?: string;
  email: string;
  role: UserRole;
  status: string;
  createdAt: string;
  juryId?: number;
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

export function roleLabel(role: UserRole): string {
  switch (role) {
    case "sysadmin":
    case "system_administrator":
    case "admin":
      return "System Administrator";
    case "sultan":
    case "dr_sultan":
      return "Dr. Sultan";
    case "reviewer":
    case "application_reviewer":
      return "Application Reviewer";
    case "jury":
    case "jury_member":
      return "Jury Member";
    case "audit":
    case "audit_user":
      return "Audit User";
    case "poet":
      return "Poet";
  }
}

export function roleLabelAr(role: UserRole): string {
  switch (role) {
    case "sysadmin":
    case "system_administrator":
    case "admin":
      return "مسؤول النظام";
    case "sultan":
    case "dr_sultan":
      return "د. سلطان";
    case "reviewer":
    case "application_reviewer":
      return "مراجع الطلبات";
    case "jury":
    case "jury_member":
      return "عضو لجنة التحكيم";
    case "audit":
    case "audit_user":
      return "مستخدم التدقيق";
    case "poet":
      return "شاعر";
  }
}

/** Roles that may see poet/requester identity. Jury must NEVER see identity. */
export function canSeeIdentity(role: UserRole | undefined): boolean {
  if (!role) return false;
  return role !== "jury" && role !== "jury_member";
}

/** Roles that can see ALL jury evaluations. Jury sees only their own. */
export function canSeeAllJuryEvaluations(role: UserRole | undefined): boolean {
  return (
    role === "sysadmin" ||
    role === "system_administrator" ||
    role === "admin" ||
    role === "sultan" ||
    role === "dr_sultan" ||
    role === "reviewer" ||
    role === "application_reviewer" ||
    role === "audit" ||
    role === "audit_user"
  );
}

/** Audit user is strictly read-only. */
export function isReadOnly(role: UserRole | undefined): boolean {
  return role === "audit" || role === "audit_user";
}
