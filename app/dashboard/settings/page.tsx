"use client";
import { ProtectedClientPage } from "../../client-page";
import SettingsPage from "@/pages/dashboard/SettingsPage";
export default function Page() {
  return <ProtectedClientPage component={SettingsPage} allowRoles={["reviewer", "jury", "sultan", "sysadmin", "admin"]} />;
}
