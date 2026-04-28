"use client";
import { ProtectedClientPage } from "../../client-page";
import CompetitionsPage from "@/pages/dashboard/CompetitionsPage";
export default function Page() {
  return <ProtectedClientPage component={CompetitionsPage} allowRoles={["reviewer", "jury", "sultan", "sysadmin", "admin"]} />;
}
