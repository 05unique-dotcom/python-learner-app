import { useGetProgressSummary, useListLessons, useGetLessonProgress, useGetStreak } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Code, Target, Award, ArrowRight, Flame } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Home() {
  const { data: summary, isLoading: loadingSummary } = useGetProgressSummary();
  const { data: lessons, isLoading: loadingLessons } = useListLessons();
  const { data: lessonProgress, isLoading: loadingProgress } = useGetLessonProgress();
  const { data: streak, isLoading: loadingStreak } = useGetStreak();

  if (loadingSummary || loadingLessons || loadingProgress || loadingStreak) {
    return <div className="animate-pulse space-y-8">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded"></div>)}
      </div>
      <div className="h-64 bg-muted rounded"></div>
    </div>;
  }

  const completionRate = summary && summary.totalLessons > 0 
    ? Math.round((summary.completedLessons / summary.totalLessons) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-2">Ready to write some Python?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className={`border-l-4 ${streak?.currentStreak && streak.currentStreak > 0 ? 'border-l-orange-500' : 'border-l-muted'} transition-colors`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Streak
              <Flame className={`w-4 h-4 ${streak?.currentStreak && streak.currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {streak?.currentStreak || 0}
              {streak?.todayCompleted && (
                <span className="w-2 h-2 rounded-full bg-green-500" title="Active today"></span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {streak?.currentStreak && streak.currentStreak > 0 ? 'day streak' : 'Start today!'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary hover:border-l-primary/80 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Progress
              <Target className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-3 h-2" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-chart-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Lessons
              <BookOpen className="w-4 h-4 text-chart-2" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary?.completedLessons || 0} <span className="text-lg text-muted-foreground">/ {summary?.totalLessons || 0}</span></div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Challenges
              <Code className="w-4 h-4 text-chart-3" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary?.completedChallenges || 0} <span className="text-lg text-muted-foreground">/ {summary?.totalChallenges || 0}</span></div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Accuracy
              <Award className="w-4 h-4 text-chart-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {summary && summary.totalAttempts > 0 ? Math.round((summary.correctAttempts / summary.totalAttempts) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Learning Streak</h2>
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{streak?.currentStreak || 0} <span className="text-lg text-muted-foreground font-normal">day streak</span></div>
                  <div className="text-sm text-muted-foreground">Best: {streak?.longestStreak || 0} days</div>
                </div>
              </div>
              
              <div className="flex-1 w-full overflow-hidden">
                <div className="flex items-center justify-between md:justify-end gap-2 mb-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                    const isActive = streak?.weekActivity?.[i];
                    const isToday = i === 6;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'} ${isToday ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-background' : ''}`}>
                          {isActive ? <Flame className="w-4 h-4" /> : <span className="text-xs">{day}</span>}
                        </div>
                        <span className="text-xs text-muted-foreground">{day}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-orange-500/10">
              <div className="text-sm font-medium mb-2 text-muted-foreground">Last 30 Days</div>
              <div className="flex flex-wrap gap-1">
                {streak?.monthActivity?.map((day, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-sm ${day.count > 0 ? (day.count > 2 ? 'bg-primary' : day.count > 1 ? 'bg-primary/70' : 'bg-primary/40') : 'bg-primary/10'}`}
                    title={`${day.count} activities on ${day.date}`}
                  />
                ))}
              </div>
            </div>
            
            {!streak?.todayCompleted && (
              <div className="mt-4 p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-medium flex items-center gap-2">
                <Flame className="w-4 h-4" /> Today's goal: complete at least 1 challenge to keep your streak alive!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Up Next</h2>
          <Button variant="ghost" asChild>
            <Link href="/lessons" className="flex items-center gap-2 text-primary">
              All Lessons <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-4">
          {lessons?.slice(0, 3).map(lesson => {
            const prog = lessonProgress?.find(p => p.lessonId === lesson.id);
            const isCompleted = prog?.completed;
            return (
              <Card key={lesson.id} className="hover:border-primary transition-colors overflow-hidden relative">
                {isCompleted && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                )}
                <CardHeader className="md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <CardDescription className="mt-1">{lesson.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 mt-4 md:mt-0 shrink-0">
                    <div className="text-sm text-muted-foreground">
                      {prog ? `${prog.correctChallenges}/${prog.totalChallenges} challenges` : `0/${lesson.totalChallenges} challenges`}
                    </div>
                    <Button asChild variant={isCompleted ? "outline" : "default"}>
                      <Link href={`/lessons/${lesson.id}`}>
                        {isCompleted ? 'Review' : 'Continue'}
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}