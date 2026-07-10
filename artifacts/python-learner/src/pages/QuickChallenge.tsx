import { useLocation } from "wouter";
import { useState } from "react";
import {
  useGetQuickChallenge,
  useSubmitAttempt,
  getGetQuickChallengeQueryKey,
  getGetProgressSummaryQueryKey,
  getGetLessonProgressQueryKey,
  useGetBadges,
  getGetBadgesQueryKey,
  useGetStreak,
  getGetStreakQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, CheckCircle2, XCircle, ArrowRight, Zap, Star, Flame, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const QUESTION_COUNT = 10;
const POINTS_PER_CORRECT = 10;

export function QuickChallenge() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [sessionKey, setSessionKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ correct: boolean; explanation: string; correctAnswer: string } | null>(null);
  const [points, setPoints] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const { data: challenges, isLoading, refetch } = useGetQuickChallenge(
    { count: QUESTION_COUNT },
    { query: { queryKey: [...getGetQuickChallengeQueryKey({ count: QUESTION_COUNT }), sessionKey] } }
  );

  const { data: streak } = useGetStreak({ query: { queryKey: getGetStreakQueryKey() } });
  useGetBadges({ query: { queryKey: getGetBadgesQueryKey() } });

  const submitAttempt = useSubmitAttempt();

  if (isLoading || !challenges) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (challenges.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p>No challenges available yet.</p>
        <Button onClick={() => setLocation("/")}>Go Back</Button>
      </div>
    );
  }

  const restart = () => {
    setCurrentIndex(0);
    setAnswer("");
    setResult(null);
    setPoints(0);
    setCorrectCount(0);
    setSessionKey((k) => k + 1);
    refetch();
  };

  if (currentIndex >= challenges.length) {
    const accuracy = (correctCount / challenges.length) * 100;

    let resultColor = "text-primary";
    let resultBg = "bg-primary/20";
    let resultText = "Keep practicing!";

    if (accuracy === 100) {
      resultColor = "text-yellow-500";
      resultBg = "bg-yellow-500/20";
      resultText = "Flawless!";
    } else if (accuracy >= 75) {
      resultColor = "text-green-500";
      resultBg = "bg-green-500/20";
      resultText = "Great job!";
    } else if (accuracy >= 50) {
      resultColor = "text-blue-500";
      resultBg = "bg-blue-500/20";
      resultText = "Good effort!";
    }

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {accuracy === 100 && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ["#eab308", "#3b82f6", "#ef4444", "#22c55e", "#a855f7"][Math.floor(Math.random() * 5)],
                }}
              ></div>
            ))}
          </div>
        )}

        <div className="z-10 bg-card border rounded-2xl p-8 md:p-12 shadow-xl max-w-2xl w-full text-center animate-in fade-in zoom-in slide-in-from-bottom-8 duration-700">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 border-4 ${resultColor.replace("text-", "border-")} ${resultBg}`}>
            <span className={`text-3xl font-bold ${resultColor}`}>{correctCount}/{challenges.length}</span>
          </div>

          <h1 className="text-4xl font-bold mb-2 tracking-tight">{resultText}</h1>
          <p className="text-muted-foreground text-lg mb-4 max-w-md mx-auto">
            You scored {correctCount} out of {challenges.length} in this quick challenge.
          </p>

          <div className="mb-6 inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-xl font-bold text-xl">
            <Star className="w-6 h-6 fill-current" /> +{points} points earned
          </div>

          <div className={`mb-8 p-4 rounded-xl flex items-center justify-center gap-3 font-medium ${streak?.todayCompleted ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" : "bg-muted text-muted-foreground"}`}>
            <Flame className="w-5 h-5" />
            {streak?.todayCompleted ? `Streak extended! ${streak.currentStreak} days in a row` : `Complete a quiz to start your streak!`}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" onClick={() => setLocation("/")} className="text-lg px-8">
              Back to Dashboard
            </Button>
            <Button size="lg" onClick={restart} className="text-lg px-8 gap-2">
              <RotateCcw className="w-5 h-5" /> Play Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const challenge = challenges[currentIndex];
  const progress = (currentIndex / challenges.length) * 100;

  const handleSubmit = () => {
    if (!answer) return;

    submitAttempt.mutate(
      { id: challenge.id, data: { answer } },
      {
        onSuccess: (data) => {
          setResult(data);
          if (data.correct) {
            setCorrectCount((prev) => prev + 1);
            setPoints((prev) => prev + POINTS_PER_CORRECT);
          }
          queryClient.invalidateQueries({ queryKey: getGetProgressSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetLessonProgressQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetBadgesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStreakQueryKey() });
        },
      }
    );
  };

  const handleNext = () => {
    setResult(null);
    setAnswer("");
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-16 border-b border-border flex items-center px-4 md:px-8 gap-6 shrink-0">
        <button onClick={() => setLocation("/")} className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-full hover:bg-muted">
          <X className="w-5 h-5" />
        </button>
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-sm font-medium text-muted-foreground shrink-0">{currentIndex + 1} of {challenges.length}</span>
        <div className="flex items-center gap-1.5 font-bold text-yellow-600 dark:text-yellow-400 shrink-0">
          <Star className="w-4 h-4 fill-current" /> {points}
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center">
        <div className="animate-in slide-in-from-right-8 fade-in duration-500" key={challenge.id}>
          <Badge variant="outline" className="mb-6 bg-primary/10 text-primary border-primary/20 gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Quick Challenge · {challenge.type === "multiple_choice" ? "Multiple Choice" : "Fill in the Blank"}
          </Badge>

          <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-10 font-mono tracking-tight">{challenge.question}</h2>

          <div className="space-y-4">
            {challenge.type === "multiple_choice" ? (
              <RadioGroup value={answer} onValueChange={setAnswer} disabled={!!result} className="gap-3">
                {challenge.options.map((opt, i) => (
                  <div key={i} className="relative">
                    <RadioGroupItem value={opt} id={`qopt-${i}`} className="peer sr-only" />
                    <Label
                      htmlFor={`qopt-${i}`}
                      className="flex items-center p-4 border-2 border-border rounded-xl cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted transition-colors font-mono text-base"
                    >
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={!!result}
                placeholder="Type your answer here..."
                className="font-mono text-lg p-6 h-auto"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !result) handleSubmit();
                }}
              />
            )}
          </div>
        </div>
      </main>

      <div
        className={`border-t border-border p-4 md:p-6 transition-colors duration-300 ${
          result?.correct ? "bg-green-500/10 border-green-500/20" : result?.correct === false ? "bg-red-500/10 border-red-500/20" : "bg-card"
        }`}
      >
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            {result && (
              <div className={`flex items-start gap-3 ${result.correct ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {result.correct ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 shrink-0 mt-0.5" />}
                <div>
                  <h4 className="font-bold text-lg">{result.correct ? `+${POINTS_PER_CORRECT} points!` : "Not quite."}</h4>
                  <p className="text-sm opacity-90 mt-1">{result.explanation}</p>
                  {!result.correct && (
                    <div className="mt-2 text-sm font-mono bg-background/50 p-2 rounded inline-block">
                      Correct answer: <span className="font-bold">{result.correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            {!result ? (
              <Button size="lg" className="w-full sm:w-48 text-lg" onClick={handleSubmit} disabled={!answer || submitAttempt.isPending}>
                Check Answer
              </Button>
            ) : (
              <Button
                size="lg"
                className={`w-full sm:w-48 text-lg ${result.correct ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                onClick={handleNext}
              >
                Continue <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
