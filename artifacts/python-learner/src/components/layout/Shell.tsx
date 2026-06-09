import { Link, useLocation } from "wouter";
import { Terminal, BookOpen, User, Menu, Home, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Terminal className="text-primary-foreground w-4 h-4" />
          </div>
          <span className="font-bold text-lg">Python Learner</span>
        </div>
        
        <nav className="flex-1 px-4 py-2 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location === '/' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/lessons" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.startsWith('/lessons') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Lessons</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
