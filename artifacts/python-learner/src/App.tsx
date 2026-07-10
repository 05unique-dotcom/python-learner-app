import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home } from "@/pages/Home";
import { Lessons } from "@/pages/Lessons";
import { LessonDetail } from "@/pages/LessonDetail";
import { ChallengeMode } from "@/pages/ChallengeMode";
import { QuickChallenge } from "@/pages/QuickChallenge";
import { Badges } from "@/pages/Badges";
import { Leaderboard } from "@/pages/Leaderboard";
import { Rewards } from "@/pages/Rewards";
import { Certificate } from "@/pages/Certificate";
import NotFound from "@/pages/not-found";
import { Shell } from "@/components/layout/Shell";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { ThemeProvider } from "@/hooks/use-theme";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/video">
        <VideoPlayer />
      </Route>
      <Route path="/challenges/:lessonId">
        {(params) => <ChallengeMode />}
      </Route>
      <Route path="/quick-challenge">
        <QuickChallenge />
      </Route>
      <Route path="*">
        <Shell>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/lessons" component={Lessons} />
            <Route path="/lessons/:id" component={LessonDetail} />
            <Route path="/badges" component={Badges} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/rewards" component={Rewards} />
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
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
