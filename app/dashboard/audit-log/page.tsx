"use client";
import { ProtectedClientPage } from "../../client-page";
import AdminAuditLogPage from "@/pages/dashboard/AdminAuditLogPage";
export default function Page() {
  return <ProtectedClientPage component={AdminAuditLogPage} allowRoles={["audit", "audit_user"]} />;
}
