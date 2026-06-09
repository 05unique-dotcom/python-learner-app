import { useListLessons, useGetLessonProgress } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

export function Lessons() {
  const { data: lessons, isLoading } = useListLessons();
  const { data: lessonProgress } = useGetLessonProgress();

  if (isLoading) {
    return <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded"></div>)}
    </div>;
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case 'intermediate': return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case 'advanced': return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default: return "";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Curriculum</h1>
        <p className="text-muted-foreground mt-2">Master Python step by step.</p>
      </div>

      <div className="grid gap-4 relative">
        {lessons?.map((lesson, idx) => {
          const prog = lessonProgress?.find(p => p.lessonId === lesson.id);
          const completion = prog ? (prog.correctChallenges / prog.totalChallenges) * 100 : 0;
          
          return (
            <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
              <Card className="hover:border-primary transition-all cursor-pointer group" style={{ animationDelay: `${idx * 100}ms` }}>
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {lesson.order}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold">{lesson.title}</h2>
                      <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-2">{lesson.description}</p>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <Progress value={completion} className="flex-1 h-2" />
                      <span className="text-sm font-medium shrink-0">
                        {prog ? `${prog.correctChallenges}/${prog.totalChallenges}` : `0/${lesson.totalChallenges}`} challenges
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}