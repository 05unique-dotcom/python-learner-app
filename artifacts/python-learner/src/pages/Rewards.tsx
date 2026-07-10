import { useGetRewards, useGetBadges } from "@workspace/api-client-react";
import { Progress } from "@/components/ui/progress";
import { Key, Trophy, Lock, CheckCircle2, Flame, BookOpen, Star, Award as AwardIcon } from "lucide-react";

const REWARD_ICONS: Record<string, React.ReactNode> = {
  bronze_key: <Key className="w-8 h-8" />,
  silver_key: <Key className="w-8 h-8" />,
  gold_key: <Key className="w-8 h-8" />,
  champion_prize: <Trophy className="w-8 h-8" />,
};

const REWARD_COLORS: Record<string, string> = {
  bronze_key: "from-amber-700 to-amber-900 border-amber-600/40 text-amber-200",
  silver_key: "from-slate-400 to-slate-600 border-slate-300/40 text-slate-100",
  gold_key: "from-yellow-400 to-yellow-600 border-yellow-300/40 text-yellow-100",
  champion_prize: "from-violet-500 to-fuchsia-600 border-violet-300/40 text-violet-100",
};

export function Rewards() {
  const { data: rewards, isLoading } = useGetRewards();
  const { data: badges, isLoading: loadingBadges } = useGetBadges();

  if (isLoading || loadingBadges || !rewards) {
    return <div className="p-8">Loading...</div>;
  }

  const earnedBadges = badges?.filter((b) => b.earned) ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rewards</h1>
        <p className="text-muted-foreground mt-2">Apne points, keys aur badges yahan dekho</p>
      </div>

      {/* Points overview */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 md:p-8 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Total Points</p>
            <p className="text-5xl font-bold text-violet-300 mt-1">{rewards.totalPoints}</p>
          </div>
          {rewards.nextReward ? (
            <div className="text-right">
              <p className="text-slate-400 text-sm">Next reward</p>
              <p className="font-semibold text-lg">{rewards.nextReward.name}</p>
              <p className="text-xs text-slate-500">{rewards.pointsToNextReward} points aur chahiye</p>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-slate-400 text-sm">🎉 Sabhi rewards unlock ho gaye!</p>
            </div>
          )}
        </div>

        <Progress value={rewards.progressToNextReward} className="h-3 mb-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 flex flex-col items-center border border-slate-700">
            <BookOpen className="w-5 h-5 text-violet-400 mb-2" />
            <span className="text-xl font-bold">{rewards.lessonPoints}</span>
            <span className="text-xs text-slate-400 text-center">Lesson Points</span>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 flex flex-col items-center border border-slate-700">
            <Star className="w-5 h-5 text-yellow-400 mb-2" />
            <span className="text-xl font-bold">{rewards.quizPoints}</span>
            <span className="text-xs text-slate-400 text-center">Quiz Points</span>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 flex flex-col items-center border border-slate-700">
            <Flame className="w-5 h-5 text-orange-400 mb-2" />
            <span className="text-xl font-bold">{rewards.streakPoints}</span>
            <span className="text-xs text-slate-400 text-center">Streak Points ({rewards.currentStreak}d)</span>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 flex flex-col items-center border border-slate-700">
            <Trophy className="w-5 h-5 text-fuchsia-400 mb-2" />
            <span className="text-xl font-bold">{rewards.courseBonus}</span>
            <span className="text-xs text-slate-400 text-center">Course Bonus</span>
          </div>
        </div>
      </div>

      {/* Prizes & Keys */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Prizes & Keys</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.rewards.map((r) => (
            <div
              key={r.id}
              className={`relative rounded-2xl p-5 border overflow-hidden transition-all ${
                r.unlocked
                  ? `bg-gradient-to-br ${REWARD_COLORS[r.id] ?? "from-slate-700 to-slate-900 border-slate-600 text-white"} shadow-lg`
                  : "bg-muted/30 border-border text-muted-foreground grayscale opacity-70"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                {REWARD_ICONS[r.id] ?? <Key className="w-8 h-8" />}
                {r.unlocked ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </div>
              <p className="font-bold text-lg">{r.name}</p>
              <p className="text-xs mt-1 opacity-90">{r.description}</p>
              <p className="text-xs mt-3 font-semibold uppercase tracking-wide opacity-80">
                {r.unlocked ? "Unlocked" : `${r.threshold} points required`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Badges */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Earned Badges</h2>
        {earnedBadges.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Abhi tak koi badge earn nahi hua. Lessons complete karo aur badges unlock karo!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {earnedBadges.map((b) => (
              <div key={b.id} className="rounded-xl border border-border bg-card p-4 flex flex-col items-center text-center gap-2 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <AwardIcon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-sm">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
