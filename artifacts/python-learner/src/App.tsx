import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VideoPlayer } from "@/components/video/VideoPlayer";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <VideoPlayer />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
