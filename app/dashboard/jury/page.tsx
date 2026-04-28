"use client";
import { ProtectedClientPage } from "../../client-page";
import JuryPage from "@/pages/dashboard/JuryPage";
export default function Page() {
  return <ProtectedClientPage component={JuryPage} allowRoles={["reviewer", "sysadmin", "admin"]} />;
}
