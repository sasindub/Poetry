"use client";
import { ProtectedClientPage } from "../../../client-page";
import SubmissionDetail from "@/pages/dashboard/SubmissionDetail";
export default function Page() {
  return <ProtectedClientPage component={SubmissionDetail} allowRoles={["reviewer", "sultan", "sysadmin", "admin"]} />;
}
