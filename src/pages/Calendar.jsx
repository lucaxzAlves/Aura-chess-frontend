import { useMemo, useState } from "react";

const tournaments = [
  {
    id: 1,
    name: "Paulista Rapid Masters",
    date: "2026-04-05",
    city: "São Paulo",
    region: "São Paulo",
    location: "Clube de Xadrez São Paulo",
    timeControl: "Rapid",
    averageRating: 1780,
    ratingCategory: "U2000",
    entryFee: "R$ 80",
    recommendationLevel: "Best",
    recommendationScore: 94,
    reasons: [
      "Good rating opportunity",
      "Strong but playable field",
      "Close to your region",
      "Matches your current training goals",
    ],
    notes: "Excellent fit for improving conversion in longer rapid games.",
  },
  {
    id: 2,
    name: "Curitiba Classical Open",
    date: "2026-04-08",
    city: "Curitiba",
    region: "Paraná",
    location: "Centro Civico Chess Hall",
    timeControl: "Classical",
    averageRating: 1840,
    ratingCategory: "Open",
    entryFee: "R$ 120",
    recommendationLevel: "Highly recommended",
    recommendationScore: 88,
    reasons: ["Longer games suit your rapid strength", "Strong training value"],
    notes: "Best if you want serious endgame practice.",
  },
  {
    id: 3,
    name: "Rio Blitz Arena",
    date: "2026-04-11",
    city: "Rio de Janeiro",
    region: "Rio de Janeiro",
    location: "Botafogo Chess Studio",
    timeControl: "Blitz",
    averageRating: 1690,
    ratingCategory: "U1800",
    entryFee: "R$ 45",
    recommendationLevel: "Good",
    recommendationScore: 74,
    reasons: ["Useful clock-pressure practice", "Playable rating pool"],
    notes: "Good for testing your time-management work.",
  },
  {
    id: 4,
    name: "Minas Invitational Rapid",
    date: "2026-04-13",
    city: "Belo Horizonte",
    region: "Minas Gerais",
    location: "Savassi Cultural Center",
    timeControl: "Rapid",
    averageRating: 1725,
    ratingCategory: "U1800",
    entryFee: "R$ 70",
    recommendationLevel: "Highly recommended",
    recommendationScore: 86,
    reasons: ["Good rating opportunity", "Balanced field"],
    notes: "A practical tournament for stabilizing middlegame decisions.",
  },
  {
    id: 5,
    name: "Online Bullet Sprint",
    date: "2026-04-17",
    city: "Online",
    region: "Online",
    location: "Chess.com Arena",
    timeControl: "Bullet",
    averageRating: 1610,
    ratingCategory: "Open",
    entryFee: "Free",
    recommendationLevel: "Low priority",
    recommendationScore: 42,
    reasons: ["Low travel cost", "Fast tactical reps"],
    notes: "Fun, but not aligned with current training priorities.",
  },
  {
    id: 6,
    name: "Campinas Spring Open",
    date: "2026-04-19",
    city: "Campinas",
    region: "São Paulo",
    location: "Campinas Chess Club",
    timeControl: "Classical",
    averageRating: 1765,
    ratingCategory: "U2000",
    entryFee: "R$ 100",
    recommendationLevel: "Good",
    recommendationScore: 78,
    reasons: ["Close to your region", "Strong endgame exposure"],
    notes: "Good field if you want slower games without an elite pool.",
  },
  {
    id: 7,
    name: "Londrina Blitz Night",
    date: "2026-04-24",
    city: "Londrina",
    region: "Paraná",
    location: "Londrina Mind Sports",
    timeControl: "Blitz",
    averageRating: 1580,
    ratingCategory: "U1600",
    entryFee: "R$ 35",
    recommendationLevel: "Good",
    recommendationScore: 69,
    reasons: ["Playable field", "Time management practice"],
    notes: "Useful as a low-pressure blitz checkpoint.",
  },
  {
    id: 8,
    name: "Online Rapid League",
    date: "2026-04-27",
    city: "Online",
    region: "Online",
    location: "Lichess Team Battle",
    timeControl: "Rapid",
    averageRating: 1820,
    ratingCategory: "Open",
    entryFee: "Free",
    recommendationLevel: "Highly recommended",
    recommendationScore: 84,
    reasons: ["Flexible schedule", "Matches your current training goals"],
    notes: "A strong online option with meaningful rapid games.",
  },
];

const trainingDays = [
  { day: 1, status: "Completed", type: "Calculation", duration: "35 min", difficulty: "Medium", reason: "Warm up tactical pattern recognition." },
  { day: 2, status: "Completed", type: "Endgames", duration: "40 min", difficulty: "Hard", reason: "Endgame technique needs targeted repetition." },
  { day: 3, status: "Missed", type: "Opening review", duration: "25 min", difficulty: "Easy", reason: "Patch common move-order gaps." },
  { day: 4, status: "Completed", type: "Game analysis", duration: "45 min", difficulty: "Medium", reason: "Review recent conversion mistakes." },
  { day: 5, status: "Rest day", type: "Rest", duration: "0 min", difficulty: "Easy", reason: "Scheduled recovery day." },
  { day: 6, status: "Completed", type: "Blitz discipline", duration: "30 min", difficulty: "Medium", reason: "Practice faster candidate-move decisions." },
  { day: 7, status: "Completed", type: "Calculation", duration: "30 min", difficulty: "Medium", reason: "Keep tactical sharpness consistent." },
  { day: 8, status: "Completed", type: "Endgames", duration: "45 min", difficulty: "Hard", reason: "Rook endings remain a priority." },
  { day: 9, status: "Missed", type: "Opening review", duration: "25 min", difficulty: "Easy", reason: "Preparation gaps lead to difficult middlegames." },
  { day: 10, status: "Completed", type: "Game analysis", duration: "50 min", difficulty: "Medium", reason: "Find recurring decision errors." },
  { day: 11, status: "Completed", type: "Blitz discipline", duration: "30 min", difficulty: "Medium", reason: "Time Management is a weak stat." },
  { day: 12, status: "Rest day", type: "Rest", duration: "0 min", difficulty: "Easy", reason: "Recovery before a heavier block." },
  { day: 13, status: "Completed", type: "Endgames", duration: "40 min", difficulty: "Hard", reason: "Endgames are recommended because Analysis shows low Endgame Performance." },
  { day: 14, status: "Completed", type: "Calculation", duration: "35 min", difficulty: "Medium", reason: "Improve forcing-line confidence." },
  { day: 15, status: "Completed", type: "Opening review", duration: "30 min", difficulty: "Easy", reason: "Improve first-10-move clarity." },
  { day: 16, status: "Missed", type: "Game analysis", duration: "45 min", difficulty: "Medium", reason: "Review recent losses for patterns." },
  { day: 17, status: "Completed", type: "Blitz discipline", duration: "30 min", difficulty: "Medium", reason: "Reduce clock-pressure errors." },
  { day: 18, status: "Completed", type: "Endgames", duration: "45 min", difficulty: "Hard", reason: "Convert winning rook endings more cleanly." },
  { day: 19, status: "Recommended", type: "Calculation", duration: "35 min", difficulty: "Medium", reason: "Today is a good tactical maintenance day." },
  { day: 20, status: "Rest day", type: "Rest", duration: "0 min", difficulty: "Easy", reason: "Prevent burnout and consolidate work." },
  { day: 21, status: "Recommended", type: "Opening review", duration: "30 min", difficulty: "Easy", reason: "Opening Review is one of your recommended focus areas." },
  { day: 22, status: "Recommended", type: "Game analysis", duration: "45 min", difficulty: "Medium", reason: "Analyze games before the next tournament block." },
  { day: 23, status: "Recommended", type: "Blitz discipline", duration: "30 min", difficulty: "Medium", reason: "Time Management needs repeated practice." },
  { day: 24, status: "Recommended", type: "Endgames", duration: "45 min", difficulty: "Hard", reason: "Endgames remain a high-impact weakness." },
  { day: 25, status: "Rest day", type: "Rest", duration: "0 min", difficulty: "Easy", reason: "Recovery day." },
  { day: 26, status: "Recommended", type: "Calculation", duration: "35 min", difficulty: "Medium", reason: "Prepare tactical vision before tournament games." },
  { day: 27, status: "Recommended", type: "Opening review", duration: "30 min", difficulty: "Easy", reason: "Refresh common structures." },
  { day: 28, status: "Recommended", type: "Game analysis", duration: "45 min", difficulty: "Medium", reason: "Turn recent mistakes into training cues." },
  { day: 29, status: "Recommended", type: "Blitz discipline", duration: "30 min", difficulty: "Medium", reason: "Practice spending time intentionally." },
  { day: 30, status: "Recommended", type: "Endgames", duration: "45 min", difficulty: "Hard", reason: "Close the month with a technical block." },
];

const tournamentFilters = {
  regions: ["All regions", "São Paulo", "Paraná", "Rio de Janeiro", "Minas Gerais", "Online"],
  timeControls: ["All", "Classical", "Rapid", "Blitz", "Bullet"],
  ratingRanges: ["All levels", "U1600", "U1800", "U2000", "Open"],
  recommendations: ["All", "Best", "Highly recommended", "Good", "Low priority"],
};

const trainingSummary = [
  { label: "Current streak", value: "6 days" },
  { label: "Trained days", value: "18/30" },
  { label: "Training hours", value: "24h" },
  { label: "Completion rate", value: "72%" },
];

const weaknessFocus = ["Time Management", "Endgames", "Opening Review"];

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10 transition-all duration-200 hover:border-purple-500/30 ${className}`}
    >
      {children}
    </div>
  );
}

function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="grid gap-2 text-sm text-slate-400">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-3 text-sm text-slate-200 outline-none transition duration-200 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function recommendationClasses(level) {
  const styles = {
    Best: "border-purple-400/50 bg-purple-500/20 text-purple-100 shadow-[0_0_18px_rgba(168,85,247,0.35)]",
    "Highly recommended": "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
    Good: "border-sky-400/35 bg-sky-500/15 text-sky-200",
    "Low priority": "border-slate-500/25 bg-slate-500/10 text-slate-300",
  };

  return styles[level] || styles.Good;
}

function statusClasses(status) {
  const styles = {
    Completed: "border-purple-500/35 bg-purple-500/15 text-purple-100",
    Recommended: "border-emerald-400/50 bg-emerald-500/10 text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.2)]",
    Missed: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    "Rest day": "border-slate-500/20 bg-slate-500/10 text-slate-400",
  };

  return styles[status];
}

function monthDays() {
  return Array.from({ length: 30 }, (_, index) => index + 1);
}

function TournamentTab() {
  const [region, setRegion] = useState("All regions");
  const [city, setCity] = useState("");
  const [timeControl, setTimeControl] = useState("All");
  const [ratingRange, setRatingRange] = useState("All levels");
  const [recommendation, setRecommendation] = useState("All");
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((tournament) => {
      const matchesRegion = region === "All regions" || tournament.region === region;
      const matchesCity = tournament.city.toLowerCase().includes(city.trim().toLowerCase());
      const matchesTime = timeControl === "All" || tournament.timeControl === timeControl;
      const matchesRating = ratingRange === "All levels" || tournament.ratingCategory === ratingRange;
      const matchesRecommendation =
        recommendation === "All" || tournament.recommendationLevel === recommendation;

      return matchesRegion && matchesCity && matchesTime && matchesRating && matchesRecommendation;
    });
  }, [city, ratingRange, recommendation, region, timeControl]);

  const bestTournament = [...filteredTournaments].sort(
    (a, b) => b.recommendationScore - a.recommendationScore
  )[0] || tournaments[0];

  const tournamentsByDay = useMemo(() => {
    return filteredTournaments.reduce((days, tournament) => {
      const day = Number(tournament.date.split("-")[2]);
      return { ...days, [day]: [...(days[day] || []), tournament] };
    }, {});
  }, [filteredTournaments]);

  return (
    <div className="grid gap-6">
      <Card className="p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr_1fr_1fr_1fr]">
          <SelectFilter label="Region" value={region} onChange={setRegion} options={tournamentFilters.regions} />
          <label className="grid gap-2 text-sm text-slate-400">
            City
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Search by city..."
              className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-slate-600 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"
            />
          </label>
          <SelectFilter label="Time control" value={timeControl} onChange={setTimeControl} options={tournamentFilters.timeControls} />
          <SelectFilter label="Rating range" value={ratingRange} onChange={setRatingRange} options={tournamentFilters.ratingRanges} />
          <SelectFilter label="Recommendation" value={recommendation} onChange={setRecommendation} options={tournamentFilters.recommendations} />
        </div>
      </Card>

      <Card className="overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-white/[0.05] to-slate-950/60 p-6 shadow-2xl shadow-purple-950/20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-300">
              Best Tournament This Month
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{bestTournament.name}</h2>
            <p className="mt-2 text-sm text-slate-400">
              {bestTournament.date} · {bestTournament.city}, {bestTournament.region} · {bestTournament.timeControl}
            </p>
          </div>
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Score</p>
            <p className="mt-1 text-3xl font-semibold text-white">{bestTournament.recommendationScore}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[
            ["Recommendation", bestTournament.recommendationLevel],
            ["Average rating", bestTournament.averageRating],
            ["Rating category", bestTournament.ratingCategory],
            ["Entry fee", bestTournament.entryFee],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-slate-950/45 p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-1 font-medium text-slate-100">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {bestTournament.reasons.map((reason) => (
            <span key={reason} className="rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1.5 text-sm text-purple-200">
              {reason}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">April 2026</h2>
            <p className="text-sm text-slate-500">{filteredTournaments.length} tournaments</p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {monthDays().map((day) => (
                  <div key={day} className="min-h-28 rounded-xl border border-white/10 bg-slate-950/35 p-2 text-left">
                    <p className="text-sm font-medium text-slate-300">{day}</p>
                    <div className="mt-2 grid gap-1.5">
                      {(tournamentsByDay[day] || []).map((tournament) => (
                        <button
                          key={tournament.id}
                          type="button"
                          onClick={() => setSelectedTournament(tournament)}
                          className={`truncate rounded-lg border px-2 py-1 text-left text-xs transition duration-200 hover:scale-[1.01] ${recommendationClasses(tournament.recommendationLevel)}`}
                        >
                          {tournament.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-purple-300">Tournament details</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{selectedTournament.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{selectedTournament.notes}</p>
          <div className="mt-5 grid gap-3 text-sm">
            {[
              ["Date", selectedTournament.date],
              ["Location", selectedTournament.location],
              ["Region", selectedTournament.region],
              ["City", selectedTournament.city],
              ["Time control", selectedTournament.timeControl],
              ["Average rating", selectedTournament.averageRating],
              ["Rating category", selectedTournament.ratingCategory],
              ["Entry fee", selectedTournament.entryFee],
              ["Level", selectedTournament.recommendationLevel],
              ["Score", selectedTournament.recommendationScore],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 rounded-xl bg-slate-950/45 px-4 py-3">
                <span className="text-slate-500">{label}</span>
                <span className="text-right font-medium text-slate-200">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2">
            {selectedTournament.reasons.map((reason) => (
              <div key={reason} className="rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm text-purple-100">
                {reason}
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button className="rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-400" type="button">
              Add to my plan
            </button>
            <button className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-purple-500/40 hover:bg-purple-500/10" type="button">
              View details
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TrainingTab() {
  const [selectedDay, setSelectedDay] = useState(trainingDays[18]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {trainingSummary.map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">April Training Plan</h2>
            <p className="text-sm text-slate-500">30-day consistency map</p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {trainingDays.map((day) => (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-24 rounded-xl border p-2 text-left transition duration-200 hover:scale-[1.01] ${statusClasses(day.status)} ${
                      selectedDay.day === day.day ? "ring-2 ring-purple-400/70" : ""
                    }`}
                  >
                    <p className="text-sm font-semibold">{day.day}</p>
                    <p className="mt-2 truncate text-xs">{day.type}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          <Card className="p-6">
            <p className="text-sm font-medium text-purple-300">Selected day</p>
            <h2 className="mt-2 text-xl font-semibold text-white">April {selectedDay.day}, 2026</h2>
            <div className="mt-5 grid gap-3 text-sm">
              {[
                ["Status", selectedDay.status],
                ["Training", selectedDay.type],
                ["Duration", selectedDay.duration],
                ["Difficulty", selectedDay.difficulty],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 rounded-xl bg-slate-950/45 px-4 py-3">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-medium text-slate-200">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-xl border border-purple-500/20 bg-purple-500/10 p-4 text-sm leading-6 text-purple-100">
              {selectedDay.reason}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">Training Streak</h2>
            <div className="mt-5 flex gap-2">
              {trainingDays.slice(10, 24).map((day) => (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`h-8 w-8 rounded-lg border text-xs font-medium transition hover:scale-105 ${statusClasses(day.status)}`}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white">Training based on your weaknesses</h2>
        <p className="mt-2 text-sm text-slate-400">
          The daily plan is generated from mock Analysis insights and prioritizes the lowest scoring areas.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {weaknessFocus.map((focus) => (
            <div key={focus} className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-5">
              <p className="font-semibold text-white">{focus}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Scheduled repeatedly this month to turn a recurring weakness into a measurable habit.
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function Calendar() {
  const [activeTab, setActiveTab] = useState("Tournaments");

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-white/[0.04] to-transparent p-6">
        <p className="text-sm font-medium text-purple-300">Chess routine</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Calendar</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Find tournaments, plan your training, and keep your chess routine alive.
        </p>

        <div className="mt-6 inline-flex rounded-xl border border-white/10 bg-slate-950/60 p-1">
          {["Tournaments", "Training Plan"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition duration-200 ${
                activeTab === tab
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-950/30"
                  : "text-slate-400 hover:bg-purple-500/10 hover:text-purple-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Tournaments" ? <TournamentTab /> : <TrainingTab />}
    </section>
  );
}
