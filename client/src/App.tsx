import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AddCandidate from "@/pages/add-candidate";
import Candidates from "@/pages/candidates";
import SidebarNav from "@/components/sidebar-nav";

function Router() {
  return (
    <div className="flex h-screen">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto bg-background">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/add-candidate" component={AddCandidate} />
          <Route path="/candidates" component={Candidates} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
