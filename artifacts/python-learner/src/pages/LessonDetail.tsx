import { useParams, Link } from "wouter";
import { useGetLesson, useGetLessonChallenges, getGetLessonQueryKey, getGetLessonChallengesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function LessonDetail() {
  const params = useParams();
  const lessonId = parseInt(params.id || "0", 10);
  
  const { data: lesson, isLoading: loadingLesson } = useGetLesson(lessonId, {
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId) }
  });
  
  const { data: challenges, isLoading: loadingChallenges } = useGetLessonChallenges(lessonId, {
    query: { enabled: !!lessonId, queryKey: getGetLessonChallengesQueryKey(lessonId) }
  });

  if (loadingLesson || loadingChallenges) {
    return <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-64 w-full" />
    </div>;
  }

  if (!lesson) return <div>Lesson not found</div>;

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in fade-in duration-500">
      <Button variant="ghost" asChild className="mb-6 -ml-4">
        <Link href="/lessons" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Lessons
        </Link>
      </Button>

      <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{lesson.title}</h1>
        <p className="text-xl text-muted-foreground border-b border-border pb-6">{lesson.description}</p>
        
        <div className="mt-8 text-lg leading-relaxed whitespace-pre-wrap font-sans">
          {lesson.content}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center mt-12 shadow-sm">
        <h3 className="text-2xl font-bold mb-2">Ready to test your knowledge?</h3>
        <p className="text-muted-foreground mb-6">Complete {lesson.totalChallenges} challenges to master this lesson.</p>
        <Button size="lg" className="w-full sm:w-auto text-lg px-8" asChild>
          <Link href={`/challenges/${lesson.id}`} className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5" /> Start Challenges
          </Link>
        </Button>
      </div>
    </div>
  );
}