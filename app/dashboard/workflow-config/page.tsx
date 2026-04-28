"use client";
import { ProtectedClientPage } from "../../client-page";
import AdminWorkflowConfigPage from "@/pages/dashboard/AdminWorkflowConfigPage";
export default function Page() {
  return <ProtectedClientPage component={AdminWorkflowConfigPage} allowRoles={["sysadmin", "admin"]} />;
}
