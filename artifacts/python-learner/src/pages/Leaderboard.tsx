import { useEffect } from "react";
import { useGetLeaderboard, useUpdateMe } from "@workspace/api-client-react";
import { Award, BookOpen, Target } from "lucide-react";

const RANK_STYLES: Record<number, { badge: string; ring: string; glow: string }> = {
  0: { badge: "🥇", ring: "ring-yellow-400/60", glow: "shadow-[0_0_25px_rgba(250,204,21,0.25)]" },
  1: { badge: "🥈", ring: "ring-slate-300/50", glow: "shadow-[0_0_20px_rgba(203,213,225,0.2)]" },
  2: { badge: "🥉", ring: "ring-amber-600/50", glow: "shadow-[0_0_20px_rgba(217,119,6,0.2)]" },
};

export function Leaderboard() {
  const { data: entries, isLoading } = useGetLeaderboard();
  const { mutate: updateMe } = useUpdateMe();

  useEffect(() => {
    const savedName = localStorage.getItem("pythonLearnerName");
    if (savedName && savedName.trim().length > 0) {
      updateMe({ data: { displayName: savedName.trim() } });
    }
  }, [updateMe]);

  if (isLoading || !entries) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Real learner points — jitna zyada seekhoge, utna upar jaoge</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 md:p-8 shadow-2xl">
        {/* Podium for top 3 */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 items-end">
          {[1, 0, 2].map((idx) => {
            const entry = entries[idx];
            if (!entry) return <div key={idx} />;
            const style = RANK_STYLES[idx];
            const height = idx === 0 ? "h-40 md:h-48" : idx === 1 ? "h-32 md:h-40" : "h-28 md:h-32";
            return (
              <div key={entry.userId} className="flex flex-col items-center">
                <div className="text-3xl md:text-4xl mb-2">{style.badge}</div>
                <div
                  className={`w-full max-w-[140px] rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 ring-2 ${style.ring} ${style.glow} flex flex-col items-center justify-center px-2 py-3 ${height} ${
                    entry.isYou ? "outline outline-2 outline-violet-400" : ""
                  }`}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-violet-600/20 border border-violet-400/30 flex items-center justify-center text-white font-bold text-sm md:text-base mb-2">
                    {entry.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="text-white text-xs md:text-sm font-semibold text-center truncate w-full">
                    {entry.isYou ? `${entry.displayName} (You)` : entry.displayName}
                  </p>
                  <p className="text-violet-300 font-bold text-sm md:text-base mt-1">{entry.points} pts</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-left uppercase text-xs tracking-wider">
                <th className="py-3 pl-2 pr-2 w-12">#</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2 text-center">
                  <span className="inline-flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Points</span>
                </th>
                <th className="py-3 px-2 text-center">
                  <span className="inline-flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Badges</span>
                </th>
                <th className="py-3 px-2 text-center">
                  <span className="inline-flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Lessons</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={entry.userId}
                  className={`border-b border-slate-800/60 transition-colors ${
                    entry.isYou
                      ? "bg-violet-500/10 hover:bg-violet-500/15"
                      : "hover:bg-slate-800/40"
                  }`}
                >
                  <td className="py-3 pl-2 pr-2 font-bold text-slate-300">
                    {i < 3 ? (
                      <span className="text-lg">{RANK_STYLES[i].badge}</span>
                    ) : (
                      <span className="text-slate-500">{i + 1}</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          entry.isYou
                            ? "bg-violet-500 text-white"
                            : "bg-slate-700 text-slate-200"
                        }`}
                      >
                        {entry.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className={`font-medium ${entry.isYou ? "text-violet-300" : "text-slate-200"}`}>
                        {entry.displayName}
                        {entry.isYou && (
                          <span className="ml-2 text-[10px] uppercase tracking-wide bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full border border-violet-400/30">
                            You
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-semibold text-slate-200">{entry.points}</td>
                  <td className="py-3 px-2 text-center text-slate-300">{entry.badgesEarned}</td>
                  <td className="py-3 px-2 text-center text-slate-300">{entry.completedLessons}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Rankings based on real points earned from lessons, quizzes, streaks, and course completion.
      </p>
    </div>
  );
}
