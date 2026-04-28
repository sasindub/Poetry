"use client";
import { ProtectedClientPage } from "../../client-page";
import AdminFormConfigPage from "@/pages/dashboard/AdminFormConfigPage";
export default function Page() {
  return <ProtectedClientPage component={AdminFormConfigPage} allowRoles={["sysadmin", "admin"]} />;
}
