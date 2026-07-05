import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Shell } from "@/components/layout/Shell";
import { Home } from "@/pages/Home";
import { Lessons } from "@/pages/Lessons";
import { LessonDetail } from "@/pages/LessonDetail";
import { ChallengeMode } from "@/pages/ChallengeMode";
import { Badges } from "@/pages/Badges";
import { Certificate } from "@/pages/Certificate";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/challenges/:lessonId" component={ChallengeMode} />
      <Route path="*">
        <Shell>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/lessons" component={Lessons} />
            <Route path="/lessons/:id" component={LessonDetail} />
            <Route path="/badges" component={Badges} />
            <Route path="/certificate" component={Certificate} />
            <Route component={NotFound} />
          </Switch>
        </Shell>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;