"use client";
import { ProtectedClientPage } from "../../client-page";
import EvaluationsPage from "@/pages/dashboard/EvaluationsPage";
export default function Page() {
  return <ProtectedClientPage component={EvaluationsPage} allowRoles={["reviewer", "jury", "sultan", "sysadmin", "admin", "audit", "audit_user"]} />;
}
