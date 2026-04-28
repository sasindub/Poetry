"use client";
import { ProtectedClientPage } from "../../client-page";
import SubmissionsPage from "@/pages/dashboard/SubmissionsPage";
export default function Page() {
  return <ProtectedClientPage component={SubmissionsPage} allowRoles={["reviewer", "jury", "sultan", "sysadmin", "admin"]} />;
}
