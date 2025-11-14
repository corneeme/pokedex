import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TransitionProvider } from "@/lib/transition-context";
import HomePage from "@/pages/HomePage";
import PokemonDetail from "@/pages/PokemonDetail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/pokemon/:id" component={PokemonDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TransitionProvider>
          <Toaster />
          <Router />
        </TransitionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
