"use client";
import { ProtectedClientPage } from "../../client-page";
import ReportsPage from "@/pages/dashboard/ReportsPage";
export default function Page() {
  return <ProtectedClientPage component={ReportsPage} allowRoles={["reviewer", "sultan", "sysadmin", "admin", "audit", "audit_user"]} />;
}
