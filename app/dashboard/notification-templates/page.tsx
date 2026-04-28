"use client";
import { ProtectedClientPage } from "../../client-page";
import AdminNotificationTemplatesPage from "@/pages/dashboard/AdminNotificationTemplatesPage";
export default function Page() {
  return <ProtectedClientPage component={AdminNotificationTemplatesPage} allowRoles={["sysadmin", "admin"]} />;
}
