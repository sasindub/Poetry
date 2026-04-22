import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ThemeProvider } from "@/hooks/useTheme";
import { AccessibilityProvider } from "@/hooks/useAccessibility";
import { isAuthenticated } from "@/lib/auth";
import HomePage from "@/pages/HomePage";
import SubmitPage from "@/pages/SubmitPage";
import LoginPage from "@/pages/LoginPage";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import SubmissionsPage from "@/pages/dashboard/SubmissionsPage";
import SubmissionDetail from "@/pages/dashboard/SubmissionDetail";
import UsersPage from "@/pages/dashboard/UsersPage";
import JuryPage from "@/pages/dashboard/JuryPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import AdminRolesPermissionsPage from "@/pages/dashboard/AdminRolesPermissionsPage";
import AdminWorkflowConfigPage from "@/pages/dashboard/AdminWorkflowConfigPage";
import AdminFormConfigPage from "@/pages/dashboard/AdminFormConfigPage";
import AdminNotificationTemplatesPage from "@/pages/dashboard/AdminNotificationTemplatesPage";
import AdminAuditLogPage from "@/pages/dashboard/AdminAuditLogPage";
import AccessDenied from "@/pages/dashboard/AccessDenied";
import NotFound from "@/pages/not-found";
import { getAuthUser, type UserRole } from "@/lib/auth";
import { hasAnyRole } from "@/lib/permissions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function ProtectedRoute({
  component: Component,
  allowRoles,
}: {
  component: React.ComponentType;
  allowRoles?: UserRole[];
}) {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }
  if (allowRoles?.length) {
    const user = getAuthUser();
    if (!user || !hasAnyRole(user.role, allowRoles)) {
      return <AccessDenied />;
    }
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={HomePage} />
      <Route path="/submit" component={SubmitPage} />
      <Route path="/login" component={LoginPage} />

      {/* Dashboard */}
      <Route path="/dashboard">
        <ProtectedRoute component={DashboardHome} allowRoles={["reviewer", "jury", "sultan", "sysadmin", "admin"]} />
      </Route>
      <Route path="/dashboard/submissions">
        <ProtectedRoute component={SubmissionsPage} allowRoles={["reviewer", "jury", "sultan", "sysadmin", "admin"]} />
      </Route>
      <Route path="/dashboard/submissions/:id">
        <ProtectedRoute
          component={SubmissionDetail}
          allowRoles={["reviewer", "sultan", "sysadmin", "admin"]}
        />
      </Route>
      <Route path="/dashboard/users">
        <ProtectedRoute component={UsersPage} allowRoles={["sysadmin", "admin"]} />
      </Route>
      <Route path="/dashboard/jury">
        <ProtectedRoute component={JuryPage} allowRoles={["reviewer", "sysadmin", "admin"]} />
      </Route>
      <Route path="/dashboard/roles-permissions">
        <ProtectedRoute component={AdminRolesPermissionsPage} allowRoles={["sysadmin", "admin"]} />
      </Route>
      <Route path="/dashboard/workflow-config">
        <ProtectedRoute component={AdminWorkflowConfigPage} allowRoles={["sysadmin", "admin"]} />
      </Route>
      <Route path="/dashboard/form-config">
        <ProtectedRoute component={AdminFormConfigPage} allowRoles={["sysadmin", "admin"]} />
      </Route>
      <Route path="/dashboard/notification-templates">
        <ProtectedRoute component={AdminNotificationTemplatesPage} allowRoles={["sysadmin", "admin"]} />
      </Route>
      <Route path="/dashboard/audit-log">
        <ProtectedRoute component={AdminAuditLogPage} allowRoles={["audit", "audit_user"]} />
      </Route>
      <Route path="/dashboard/settings">
        <ProtectedRoute component={SettingsPage} allowRoles={["reviewer", "jury", "sultan", "sysadmin", "admin"]} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AccessibilityProvider>
            <LanguageProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
            </LanguageProvider>
          </AccessibilityProvider>
        </ThemeProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
