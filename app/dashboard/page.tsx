"use client";
import { ProtectedClientPage } from "../client-page";
import DashboardHome from "@/pages/dashboard/DashboardHome";
export default function Page() {
  return <ProtectedClientPage component={DashboardHome} allowRoles={["reviewer", "jury", "sultan", "sysadmin", "admin"]} />;
}
