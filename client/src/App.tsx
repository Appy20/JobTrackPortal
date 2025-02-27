import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/protected-route";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AddCandidate from "@/pages/add-candidate";
import Candidates from "@/pages/candidates";
import AuthPage from "@/pages/auth";
import SidebarNav from "@/components/sidebar-nav";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />

      <Route path="*">
        <div className="flex h-screen">
          <SidebarNav />
          <main className="flex-1 overflow-y-auto bg-background">
            <Switch>
              <ProtectedRoute path="/" component={Dashboard} />
              <ProtectedRoute path="/add-candidate" component={AddCandidate} />
              <ProtectedRoute path="/candidates" component={Candidates} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;