"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getAuthUser, type UserRole } from "@/lib/auth";
import { hasAnyRole } from "@/lib/permissions";
import AccessDenied from "@/pages/dashboard/AccessDenied";

interface Props {
  component: React.ComponentType;
  allowRoles?: UserRole[];
}

export function ProtectedClientPage({ component: Component, allowRoles }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    if (allowRoles?.length) {
      const user = getAuthUser();
      if (!user || !hasAnyRole(user.role, allowRoles)) {
        setDenied(true);
      }
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  if (denied) return <AccessDenied />;
  return <Component />;
}

export function PublicClientPage({ component: Component }: { component: React.ComponentType }) {
  return <Component />;
}
