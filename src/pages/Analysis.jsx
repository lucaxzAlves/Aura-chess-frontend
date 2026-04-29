import { useMemo, useState } from "react";

const overviewStats = [
  {
    label: "Average Accuracy",
    value: "78.4%",
    trend: "+3.2%",
    detail: "Cleaner middlegame decisions",
  },
  {
    label: "Blunder Rate",
    value: "1.8/game",
    trend: "-0.4",
    detail: "Fewer one-move collapses",
  },
  {
    label: "Tactical Conversion",
    value: "64%",
    trend: "+6%",
    detail: "Better when initiative appears",
  },
  {
    label: "Endgame Performance",
    value: "71%",
    trend: "+2%",
    detail: "Conversion still uneven",
  },
];

const chessStats = [
  {
    label: "Calculation",
    score: 72,
    description: "Finds forcing ideas, but misses quiet defensive resources.",
  },
  {
    label: "Positional Understanding",
    score: 68,
    description: "Solid structure sense with occasional passive piece placement.",
  },
  {
    label: "Openings",
    score: 61,
    description: "Playable repertoire, but early plans are not always connected.",
  },
  {
    label: "Tactical Themes",
    score: 76,
    description: "Strong pattern recognition in pins, forks, and back-rank motifs.",
  },
  {
    label: "Endgames",
    score: 55,
    description: "Technique drops in rook endings and simplified pawn races.",
  },
  {
    label: "Middlegame",
    score: 70,
    description: "Good attacking instincts when piece activity is clear.",
  },
  {
    label: "Time Management",
    score: 49,
    description: "Clock pressure causes rushed candidate-move selection.",
  },
  {
    label: "Psychological Resilience",
    score: 58,
    description: "Recovery after setbacks is improving but still volatile.",
  },
];

const strengths = [
  {
    title: "Tactical awareness",
    impact: "High",
    description: "You detect tactical pressure quickly in open positions.",
  },
  {
    title: "Initiative in sharp positions",
    impact: "Medium",
    description: "You convert active pieces into threats before opponents stabilize.",
  },
  {
    title: "Winning-position conversion",
    impact: "High",
    description: "Material advantages are usually simplified without major risk.",
  },
];

const weaknesses = [
  {
    title: "Time pressure decisions",
    impact: "Critical",
    description: "Late-game accuracy falls sharply below two minutes.",
  },
  {
    title: "Endgame technique",
    impact: "High",
    description: "Rook and pawn endings are leaking half-points.",
  },
  {
    title: "Opening preparation gaps",
    impact: "Medium",
    description: "You reach unfamiliar structures from common move orders.",
  },
];

const timeControlAccuracy = [
  { label: "Bullet", value: 61 },
  { label: "Blitz", value: 74 },
  { label: "Rapid", value: 83 },
  { label: "Classical", value: 79 },
];

const mistakeDistribution = [
  { label: "Opening", value: 18 },
  { label: "Middlegame", value: 34 },
  { label: "Endgame", value: 27 },
  { label: "Time pressure", value: 21 },
];

const resultDistribution = [
  { label: "Wins", value: 58 },
  { label: "Losses", value: 32 },
  { label: "Draws", value: 10 },
];

const recurringPatterns = [
  {
    title: "Missed tactical shots",
    frequency: "11 games",
    impact: "High",
    description: "Candidate checks and forcing captures are skipped too quickly.",
  },
  {
    title: "Late endgame inaccuracies",
    frequency: "8 games",
    impact: "High",
    description: "King activity and pawn-break timing degrade in simplified positions.",
  },
  {
    title: "Overextension after advantage",
    frequency: "6 games",
    impact: "Medium",
    description: "Winning positions become complicated by unnecessary attacks.",
  },
  {
    title: "Poor clock management",
    frequency: "14 games",
    impact: "Critical",
    description: "Long early thinks create rushed decisions near move 30.",
  },
];

const trainingPriorities = [
  {
    title: "Time Management",
    reason: "Lowest chess stat and strongest correlation with losses.",
    impact: "Very high",
    difficulty: "Medium",
  },
  {
    title: "Endgames",
    reason: "Several drawn or winning positions are slipping late.",
    impact: "High",
    difficulty: "Hard",
  },
  {
    title: "Opening Review",
    reason: "Preparation gaps lead to uncomfortable middlegames.",
    impact: "Medium",
    difficulty: "Easy",
  },
];

const timeRanges = ["Last 7 days", "Last 30 days", "Last 90 days", "All time"];

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10 transition-all duration-200 hover:border-purple-500/30 ${className}`}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 rounded-full bg-slate-950/80">
      <div
        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400 shadow-[0_0_18px_rgba(168,85,247,0.45)]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function OverviewCard({ stat }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          {stat.label}
        </p>
        <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-300">
          {stat.trend}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-white">{stat.value}</p>
      <p className="mt-2 text-sm text-slate-500">{stat.detail}</p>
    </Card>
  );
}

function InsightList({ title, items, tone }) {
  const markerClass =
    tone === "strength"
      ? "bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.8)]"
      : "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.6)]";

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
            <div className="flex items-start gap-3">
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${markerClass}`} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">{item.title}</p>
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-slate-300">
                    {item.impact}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function BarChart({ title, data, suffix = "%" }) {
  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <div className="mt-5 grid gap-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-400">{item.label}</span>
              <span className="font-medium text-purple-300">
                {item.value}
                {suffix}
              </span>
            </div>
            <ProgressBar value={item.value} />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function Analysis() {
  const [timeRange, setTimeRange] = useState("Last 30 days");

  const profileScore = useMemo(() => {
    const total = chessStats.reduce((sum, stat) => sum + stat.score, 0);
    return Math.round(total / chessStats.length);
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-white/[0.04] to-transparent p-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-purple-300">Performance diagnosis</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Analysis</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Understand your chess profile, recurring mistakes, and training priorities.
          </p>
        </div>

        <label className="grid gap-2 text-sm text-slate-400">
          Time range
          <select
            value={timeRange}
            onChange={(event) => setTimeRange(event.target.value)}
            className="min-w-44 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-3 text-sm text-slate-200 outline-none transition duration-200 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"
          >
            {timeRanges.map((range) => (
              <option key={range}>{range}</option>
            ))}
          </select>
        </label>
      </div>

      <Card className="relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-white/[0.05] to-slate-950/60 p-5 shadow-2xl shadow-purple-950/20 sm:p-8">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />

        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-300">
              Core profile
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Chess Stats</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              A skill map of your current chess identity, scored across practical
              decision-making areas.
            </p>
          </div>
          <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-200">
            {timeRange}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[380px_1fr] xl:items-center">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-purple-500/25 bg-slate-950/60 p-8 shadow-inner shadow-purple-950/20">
            <div
              className="grid h-56 w-56 place-items-center rounded-full border border-purple-400/40 shadow-[0_0_70px_rgba(168,85,247,0.28)]"
              style={{
                background: `conic-gradient(rgb(168 85 247) ${profileScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
              }}
            >
              <div className="grid h-40 w-40 place-items-center rounded-full border border-white/10 bg-[#090b10] text-center shadow-2xl shadow-black/40">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-purple-300">
                    Profile score
                  </p>
                  <p className="mt-2 text-6xl font-semibold text-white">{profileScore}</p>
                  <p className="mt-1 text-xs text-slate-500">out of 100</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-base font-medium text-white">
              Overall Chess Profile: {profileScore}
            </p>
            <p className="mt-2 max-w-xs text-center text-sm leading-6 text-slate-400">
              Your current profile is strongest in tactics and weakest under clock
              pressure.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {chessStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-slate-950/45 p-5 transition duration-200 hover:border-purple-500/30 hover:bg-purple-500/[0.06]"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-white">{stat.label}</p>
                  <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-sm font-semibold text-purple-300">
                    {stat.score}
                  </span>
                </div>
                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">{stat.description}</p>
                <div className="mt-4">
                  <ProgressBar value={stat.score} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <OverviewCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <InsightList title="Strengths" items={strengths} tone="strength" />
        <InsightList title="Weaknesses" items={weaknesses} tone="weakness" />
      </div>

      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Performance Trends</h2>
            <p className="mt-1 text-sm text-slate-500">CSS-only visual summaries from mock data.</p>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <BarChart title="Accuracy by time control" data={timeControlAccuracy} />
          <BarChart title="Mistake distribution" data={mistakeDistribution} />
          <BarChart title="Result distribution" data={resultDistribution} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white">Recurring Patterns</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recurringPatterns.map((pattern) => (
            <Card key={pattern.title} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-white">{pattern.title}</h3>
                <span className="rounded-full bg-purple-500/10 px-2 py-1 text-xs text-purple-300">
                  {pattern.frequency}
                </span>
              </div>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Impact: {pattern.impact}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{pattern.description}</p>
              <button
                type="button"
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-300 opacity-80"
              >
                Train with AI Coach
              </button>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-xl font-semibold text-white">Recommended Focus</h2>
            <p className="mt-1 text-sm text-slate-500">
              Priority queue for future AI Coach sessions.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {trainingPriorities.map((priority, index) => (
            <div key={priority.title} className="rounded-xl border border-white/10 bg-slate-950/40 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-purple-500/10 text-sm font-semibold text-purple-300">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-white">{priority.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{priority.reason}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-white/[0.04] p-3">
                  <p className="text-xs text-slate-500">Impact</p>
                  <p className="mt-1 font-medium text-purple-300">{priority.impact}</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-3">
                  <p className="text-xs text-slate-500">Difficulty</p>
                  <p className="mt-1 font-medium text-slate-200">{priority.difficulty}</p>
                </div>
              </div>
              <button
                type="button"
                className="mt-5 w-full rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition duration-200 hover:bg-purple-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f16]"
              >
                Send to AI Coach
              </button>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
