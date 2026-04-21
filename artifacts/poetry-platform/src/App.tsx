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
import EvaluationsPage from "@/pages/dashboard/EvaluationsPage";
import CompetitionsPage from "@/pages/dashboard/CompetitionsPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
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
        <ProtectedRoute component={DashboardHome} />
      </Route>
      <Route path="/dashboard/submissions">
        <ProtectedRoute component={SubmissionsPage} />
      </Route>
      <Route path="/dashboard/submissions/:id">
        <ProtectedRoute component={SubmissionDetail} />
      </Route>
      <Route path="/dashboard/users">
        <ProtectedRoute component={UsersPage} />
      </Route>
      <Route path="/dashboard/jury">
        <ProtectedRoute component={JuryPage} />
      </Route>
      <Route path="/dashboard/evaluations">
        <ProtectedRoute component={EvaluationsPage} />
      </Route>
      <Route path="/dashboard/competitions">
        <ProtectedRoute component={CompetitionsPage} />
      </Route>
      <Route path="/dashboard/settings">
        <ProtectedRoute component={SettingsPage} />
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
