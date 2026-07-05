import { useGetBadges, getGetBadgesQueryKey, useGetProgressSummary } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, BookCheck, Star, TrendingUp, Trophy, Brain, ShieldCheck, Lock, LucideIcon } from "lucide-react";
import { format } from "date-fns";

const iconMap: Record<string, LucideIcon> = {
  "zap": Zap,
  "book-check": BookCheck,
  "star": Star,
  "trending-up": TrendingUp,
  "trophy": Trophy,
  "brain": Brain,
  "shield-check": ShieldCheck,
};

export function Badges() {
  const { data: badges, isLoading: badgesLoading } = useGetBadges({ query: { queryKey: getGetBadgesQueryKey() } });
  const { data: summary, isLoading: summaryLoading } = useGetProgressSummary();

  if (badgesLoading || summaryLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const earnedCount = badges?.filter(b => b.earned).length || 0;
  const totalCount = badges?.length || 7;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Badges</h1>
          <p className="text-muted-foreground mt-2">Earn badges by completing lessons and challenges.</p>
        </div>
        <div className="bg-card border rounded-xl p-4 flex items-center gap-4 min-w-[250px] shadow-sm">
          <Trophy className="w-8 h-8 text-primary" />
          <div className="flex-1">
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>{earnedCount} Earned</span>
              <span>{totalCount} Total</span>
            </div>
            <Progress value={(earnedCount / totalCount) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {earnedCount === 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
          <Star className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">No badges yet!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Start completing lessons and challenges to earn your first badge. You can do it!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {badges?.map((badge, index) => {
          const Icon = iconMap[badge.icon] || Star;
          
          return (
            <Card 
              key={badge.id} 
              className={`relative overflow-hidden transition-all duration-500 ${
                badge.earned 
                  ? 'border-primary/50 shadow-md hover:shadow-lg hover:border-primary animate-in fade-in zoom-in slide-in-from-bottom-4' 
                  : 'bg-muted/50 border-border opacity-70 grayscale hover:grayscale-0 transition-all'
              }`}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              {badge.earned && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 blur-xl"></div>
              )}
              
              <CardHeader className="pb-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  badge.earned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {badge.earned ? <Icon className="w-8 h-8" /> : <Lock className="w-6 h-6" />}
                </div>
                <CardTitle className="text-xl">{badge.name}</CardTitle>
                <CardDescription className="text-sm mt-1 min-h-[40px]">
                  {badge.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {badge.earned ? (
                  <div className="text-xs font-medium text-primary bg-primary/10 inline-flex px-2 py-1 rounded-md mt-2">
                    Earned on {badge.earnedAt ? format(new Date(badge.earnedAt), "MMM d, yyyy") : "Unknown date"}
                  </div>
                ) : (
                  <div className="text-xs font-medium text-muted-foreground mt-2">
                    Keep learning to unlock
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
