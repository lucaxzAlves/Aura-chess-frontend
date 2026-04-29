import { useState } from "react";

const coach = {
  name: "Coach Orion",
  style: "Universal / Positional",
  personality: "Calm, precise, demanding",
  focus: "Calculation, endgames, time management",
  philosophy: "Small daily corrections create long-term rating growth.",
  level: "Advanced",
  tags: ["Calculation", "Endgames", "Practical Decisions", "Tournament Preparation"],
  quote:
    "Your next rating jump will not come from knowing more openings. It will come from making fewer emotional decisions under pressure.",
};

const blockers = [
  {
    title: "Time pressure decisions",
    severity: "High",
    impact: "+80 to +120 rating points over 8 weeks",
    evidence: "38% of your blunders happen with less than 30 seconds on the clock.",
    why: "You calculate too deeply in non-critical positions and then rush tactical decisions later.",
    improve: [
      "Use fixed decision checkpoints",
      "Spend less time in equal positions",
      "Practice blitz positions with forced move selection",
      "Review all games where your clock dropped below 20 seconds",
    ],
    exercises: ["10 timed calculation puzzles", "3 rapid games with clock notes", "Review 5 lost blitz games"],
  },
  {
    title: "Weak endgame conversion",
    severity: "High",
    impact: "+50 to +90 rating points",
    evidence: "Winning rook endings converted at only 54% in recent games.",
    why: "You often seek tactics when the position requires patient king activation.",
    improve: ["Drill rook activity rules", "Practice pawn-race calculation", "Annotate missed simplifications"],
    exercises: ["5 rook endings", "10 king-and-pawn studies", "Review 3 converted master games"],
  },
  {
    title: "Opening preparation gaps",
    severity: "Medium",
    impact: "+30 to +60 rating points",
    evidence: "You leave book early in 41% of games and reach passive structures.",
    why: "You know moves, but not enough plans after common deviations.",
    improve: ["Map your main structures", "Prepare plans, not just moves", "Review recurring bad positions"],
    exercises: ["Build 3 opening flashcards", "Review 2 model games", "Add one anti-line plan"],
  },
  {
    title: "Missed tactical shots",
    severity: "Medium",
    impact: "+40 to +70 rating points",
    evidence: "Missed forcing moves appeared in 11 of your last 30 reviewed games.",
    why: "Candidate checks and captures are not always scanned before positional moves.",
    improve: ["Run a forcing-move scan", "Name the opponent threat", "Compare quiet and forcing candidates"],
    exercises: ["15 mixed tactics", "5 defensive puzzles", "Annotate missed candidate moves"],
  },
  {
    title: "Psychological instability after mistakes",
    severity: "Low",
    impact: "+20 to +40 rating points",
    evidence: "Accuracy drops for the next 6 moves after a clear mistake.",
    why: "You try to win the position back immediately instead of resetting the evaluation.",
    improve: ["Use a reset routine", "Trade emotional moves for practical defense", "Write one recovery rule"],
    exercises: ["Review 3 comeback games", "Practice worse-position defense", "Use post-blunder notes"],
  },
];

const plan = [
  {
    phase: "Week 1-2",
    focus: "Time management discipline",
    goal: "Build a repeatable decision rhythm before move 30.",
    tasks: ["Clock notes after each rapid game", "Timed puzzle sets", "One blitz discipline session"],
    outcome: "Fewer rushed tactical decisions.",
  },
  {
    phase: "Week 3-4",
    focus: "Endgame technique",
    goal: "Convert simple advantages without creating counterplay.",
    tasks: ["Rook activity drills", "King-and-pawn studies", "Conversion review"],
    outcome: "Cleaner wins from favorable endings.",
  },
  {
    phase: "Week 5-6",
    focus: "Tactical pattern recognition",
    goal: "Improve forcing-move scans in critical positions.",
    tasks: ["Mixed tactics", "Defensive puzzles", "Candidate-move annotations"],
    outcome: "More missed shots become visible.",
  },
  {
    phase: "Week 7-8",
    focus: "Opening review and tournament preparation",
    goal: "Enter known middlegames with clear plans.",
    tasks: ["Model games", "Anti-line prep", "Tournament checklist"],
    outcome: "Better practical confidence in upcoming events.",
  },
];

const prescriptionChecklist = [
  "Identify the first slow decision",
  "Mark the critical position",
  "Write the move you should have played",
  "Compare with engine suggestion",
  "Create one rule for next game",
];

const sourceCards = [
  ["Games", "Finds recurring mistakes"],
  ["Analysis", "Scores your chess profile"],
  ["Practice", "Assigns targeted exercises"],
  ["Calendar", "Prepares you for upcoming tournaments"],
];

const initialMessages = [
  {
    role: "coach",
    text: "I reviewed your mock profile. Your biggest rating leak is not knowledge, it is decision rhythm under pressure.",
  },
  {
    role: "user",
    text: "Should I study more openings this week?",
  },
  {
    role: "coach",
    text: "Only a little. Your opening work should support the main goal: reaching familiar middlegames with enough time to think.",
  },
];

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10 transition-all duration-200 hover:border-purple-500/30 ${className}`}
    >
      {children}
    </div>
  );
}

function severityClass(severity) {
  const styles = {
    High: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    Medium: "border-yellow-400/30 bg-yellow-400/10 text-yellow-200",
    Low: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  };

  return styles[severity];
}

function BlockerCard({ blocker, index }) {
  return (
    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-white/[0.04] to-slate-950/50 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-purple-300">Growth blocker {index + 1}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{blocker.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">{blocker.evidence}</p>
        </div>
        <span className={`w-fit rounded-full border px-3 py-1.5 text-sm font-semibold ${severityClass(blocker.severity)}`}>
          {blocker.severity}
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-slate-950/45 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Why it happens</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{blocker.why}</p>
        </div>
        <div className="rounded-xl bg-slate-950/45 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">How to improve</p>
          <ul className="mt-2 grid gap-2 text-sm text-slate-300">
            {blocker.improve.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-slate-950/45 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Exercises</p>
          <ul className="mt-2 grid gap-2 text-sm text-slate-300">
            {blocker.exercises.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-purple-200">Estimated impact: {blocker.impact}</p>
        <button
          type="button"
          className="rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-400"
        >
          Start training
        </button>
      </div>
    </Card>
  );
}

export default function AICoach() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    const cleanInput = input.trim();
    if (!cleanInput) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: cleanInput },
      {
        role: "coach",
        text: "I would connect this question to your current main weakness: time management. Before studying more theory, we should fix your decision rhythm.",
      },
    ]);
    setInput("");
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-white/[0.04] to-transparent p-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-purple-300">Personal mentor</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">AI Coach</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Your personalized chess mentor, built from your games, weaknesses, and training goals.
          </p>
        </div>
        <span className="w-fit rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-200">
          Personalized from your Analysis
        </span>
      </div>

      <Card className="overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-white/[0.05] to-slate-950/60 p-6 shadow-2xl shadow-purple-950/20">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-center">
          <div className="flex flex-col items-center rounded-3xl border border-purple-500/25 bg-slate-950/55 p-6 text-center">
            <div className="grid h-28 w-28 place-items-center rounded-3xl border border-purple-400/40 bg-purple-500/10 text-4xl font-semibold text-purple-200 shadow-[0_0_50px_rgba(168,85,247,0.28)]">
              CO
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">{coach.name}</h2>
            <p className="mt-1 text-sm text-purple-300">{coach.style}</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">"{coach.quote}"</p>
          </div>

          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Personality", coach.personality],
                ["Main focus", coach.focus],
                ["Coach level", coach.level],
                ["Philosophy", coach.philosophy],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-200">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {coach.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1.5 text-sm text-purple-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div>
        <div className="mb-5">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-300">Priority diagnosis</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Main Growth Blockers</h2>
          <p className="mt-2 text-sm text-slate-400">
            The recurring problems currently limiting your rating progress.
          </p>
        </div>
        <div className="grid gap-5">
          {blockers.map((blocker, index) => (
            <BlockerCard key={blocker.title} blocker={blocker} index={index} />
          ))}
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-white">8-Week Improvement Plan</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          {plan.map((phase) => (
            <div key={phase.phase} className="rounded-xl border border-white/10 bg-slate-950/45 p-5">
              <p className="text-sm font-medium text-purple-300">{phase.phase}</p>
              <h3 className="mt-2 font-semibold text-white">{phase.focus}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{phase.goal}</p>
              <ul className="mt-4 grid gap-2 text-sm text-slate-300">
                {phase.tasks.map((task) => (
                  <li key={task}>- {task}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-medium text-purple-200">{phase.outcome}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <p className="text-sm font-medium text-purple-300">Today's Prescription</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Review 3 recent losses where you blundered under time pressure.
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Duration", "45 min"],
              ["Difficulty", "Medium"],
              ["Reason", "Time pressure is your main blocker"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-950/45 p-4">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-medium text-slate-200">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2">
            {prescriptionChecklist.map((item) => (
              <label key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
                <input type="checkbox" className="h-4 w-4 accent-purple-500" />
                {item}
              </label>
            ))}
          </div>
          <button type="button" className="mt-5 w-full rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-400">
            Mark as completed
          </button>
        </Card>

        <Card className="flex min-h-[520px] flex-col p-6">
          <h2 className="text-2xl font-semibold text-white">Ask your Coach</h2>
          <div className="mt-5 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "coach"
                    ? "border border-purple-500/20 bg-purple-500/10 text-purple-50"
                    : "ml-auto bg-white/[0.08] text-slate-100"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              placeholder="Ask about your training..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"
            />
            <button type="button" onClick={sendMessage} className="rounded-xl bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-400">
              Send
            </button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sourceCards.map(([title, description]) => (
          <Card key={title} className="p-5">
            <p className="font-semibold text-white">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
