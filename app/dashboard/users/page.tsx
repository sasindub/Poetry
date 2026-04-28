"use client";
import { ProtectedClientPage } from "../../client-page";
import UsersPage from "@/pages/dashboard/UsersPage";
export default function Page() {
  return <ProtectedClientPage component={UsersPage} allowRoles={["sysadmin", "admin"]} />;
}
