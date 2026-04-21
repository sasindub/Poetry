import type { UserRole } from "@/lib/auth";

const roles = {
  reviewer: "reviewer",
  application_reviewer: "application_reviewer",
  jury: "jury",
  jury_member: "jury_member",
  sultan: "sultan",
  dr_sultan: "dr_sultan",
  sysadmin: "sysadmin",
  system_administrator: "system_administrator",
  admin: "admin",
  audit: "audit",
  audit_user: "audit_user",
} as const;

function normalizeRole(userRole: UserRole | undefined): UserRole | undefined {
  if (!userRole) return undefined;
  if (userRole === "application_reviewer") return "reviewer";
  if (userRole === "jury_member") return "jury";
  if (userRole === "dr_sultan") return "sultan";
  if (userRole === "system_administrator") return "sysadmin";
  if (userRole === "audit_user") return "audit";
  return userRole;
}

export function hasAnyRole(userRole: UserRole | undefined, allowed: UserRole[]): boolean {
  const role = normalizeRole(userRole);
  if (!role) return false;
  const normalizedAllowed = allowed.map((r) => normalizeRole(r)).filter(Boolean) as UserRole[];
  return normalizedAllowed.includes(role);
}

export function canAccessUsers(userRole: UserRole | undefined): boolean {
  return hasAnyRole(userRole, [roles.sysadmin, roles.admin]);
}

export function canAccessJuryPanel(userRole: UserRole | undefined): boolean {
  return hasAnyRole(userRole, [roles.reviewer, roles.sysadmin, roles.admin]);
}

export function canAccessReports(userRole: UserRole | undefined): boolean {
  return hasAnyRole(userRole, [roles.sultan, roles.sysadmin, roles.admin, roles.audit]);
}

export function canAccessSubmissionDetail(userRole: UserRole | undefined): boolean {
  return hasAnyRole(userRole, [roles.reviewer, roles.sultan, roles.sysadmin, roles.admin, roles.audit]);
}

export function canAccessEvaluations(userRole: UserRole | undefined): boolean {
  return hasAnyRole(userRole, [roles.reviewer, roles.jury, roles.sultan, roles.sysadmin, roles.admin, roles.audit]);
}
