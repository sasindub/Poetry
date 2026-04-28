"use client";
import { ProtectedClientPage } from "../../client-page";
import AdminRolesPermissionsPage from "@/pages/dashboard/AdminRolesPermissionsPage";
export default function Page() {
  return <ProtectedClientPage component={AdminRolesPermissionsPage} allowRoles={["sysadmin", "admin"]} />;
}
