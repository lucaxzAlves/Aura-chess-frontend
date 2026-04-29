import { useEffect, useMemo, useState } from "react";
import { parseChessComGame } from "../services/chessComApi.js";

const insights = [
  "Real game history is loaded from your most recent Chess.com monthly archives.",
  "Review buttons are placeholders until full analysis is implemented.",
  "Openings and move counts are parsed from available PGN headers.",
];

const timeControls = ["All", "Bullet", "Blitz", "Rapid", "Daily"];
const results = ["All", "Wins", "Losses", "Draws"];
const dateRanges = ["Last 7 days", "Last 30 days", "All time"];

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

function ResultBadge({ result }) {
  const styles = {
    Win: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    Loss: "border-rose-500/25 bg-rose-500/10 text-rose-300",
    Draw: "border-slate-500/25 bg-slate-500/10 text-slate-300",
  };

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[result]}`}>
      {result}
    </span>
  );
}

function getFilteredGameStats(games) {
  const wins = games.filter((game) => game.result === "Win").length;
  const total = games.length;
  const gamesWithAccuracy = games.filter((game) => typeof game.accuracy === "number");
  const averageAccuracy = gamesWithAccuracy.length
    ? `${Math.round(
        gamesWithAccuracy.reduce((sum, game) => sum + game.accuracy, 0) /
          gamesWithAccuracy.length
      )}%`
    : "N/A";
  const mostPlayed = Object.entries(
    games.reduce((acc, game) => {
      acc[game.timeClass] = (acc[game.timeClass] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])?.[0]?.[0];

  return [
    { label: "Filtered games", value: total },
    { label: "Win rate", value: total ? `${Math.round((wins / total) * 100)}%` : "N/A" },
    { label: "Avg accuracy", value: averageAccuracy },
    { label: "Most played", value: mostPlayed || "N/A" },
  ];
}

function inDateRange(game, dateRange) {
  if (dateRange === "All time" || !game.timestamp) return true;

  const days = dateRange === "Last 7 days" ? 7 : 30;
  const cutoff = Date.now() / 1000 - days * 24 * 60 * 60;
  return game.timestamp >= cutoff;
}

export default function Games({
  connectedUsername,
  playerGames,
  isLoadingGames,
  gamesError,
  onLoadGames,
  loadedArchivesCount,
  totalArchivesCount,
  hasMoreGames,
}) {
  const [search, setSearch] = useState("");
  const [timeControl, setTimeControl] = useState("All");
  const [result, setResult] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [selectedGameId, setSelectedGameId] = useState(null);

  useEffect(() => {
    if (connectedUsername && playerGames.length === 0 && !isLoadingGames && !gamesError) {
      onLoadGames();
    }
  }, [connectedUsername, gamesError, isLoadingGames, onLoadGames, playerGames.length]);

  const parsedGames = useMemo(() => {
    if (!connectedUsername) return [];
    return playerGames.map((game) => parseChessComGame(game, connectedUsername));
  }, [connectedUsername, playerGames]);

  const filteredGames = useMemo(() => {
    return parsedGames.filter((game) => {
      const matchesSearch = game.opponent
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesTime = timeControl === "All" || game.timeClass === timeControl;
      const resultName = result === "Wins" ? "Win" : result === "Losses" ? "Loss" : "Draw";
      const matchesResult = result === "All" || game.result === resultName;

      return matchesSearch && matchesTime && matchesResult && inDateRange(game, dateRange);
    });
  }, [dateRange, parsedGames, result, search, timeControl]);

  const selectedGame =
    filteredGames.find((game) => game.id === selectedGameId) || filteredGames[0] || null;
  const filteredGameStats = getFilteredGameStats(filteredGames);
  const isInitialLoading = isLoadingGames && playerGames.length === 0;

  if (!connectedUsername) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-lg p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Games</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Connect your Chess.com account on Home to see your games.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-white/[0.04] to-transparent p-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-purple-300">Game history</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Games</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Review recent Chess.com games for {connectedUsername}.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {filteredGameStats.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3">
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <label className="grid gap-2 text-sm text-slate-400">
            Opponent
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search opponent username"
              className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-slate-600 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/10"
            />
          </label>

          <SelectFilter
            label="Time control"
            value={timeControl}
            onChange={setTimeControl}
            options={timeControls}
          />
          <SelectFilter
            label="Result"
            value={result}
            onChange={setResult}
            options={results}
          />
          <SelectFilter
            label="Date"
            value={dateRange}
            onChange={setDateRange}
            options={dateRanges}
          />
        </div>
      </Card>

      {isInitialLoading && (
        <Card className="p-8 text-center text-sm text-slate-400">Loading games...</Card>
      )}

      {gamesError && (
        <Card className="border-rose-500/25 bg-rose-500/10 p-6 text-sm text-rose-200">
          {gamesError || "Could not load games right now."}
        </Card>
      )}

      {!isInitialLoading && (
        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <Card className="overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Recent games</h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredGames.length} games for {dateRange.toLowerCase()}.
                {totalArchivesCount > 0 &&
                  ` Loaded ${loadedArchivesCount} of ${totalArchivesCount} archives.`}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Color</th>
                    <th className="px-5 py-4 font-medium">Opponent</th>
                    <th className="px-5 py-4 font-medium">Result</th>
                    <th className="px-5 py-4 font-medium">Time</th>
                    <th className="px-5 py-4 font-medium">Rated</th>
                    <th className="px-5 py-4 font-medium">Opening</th>
                    <th className="px-5 py-4 font-medium">Date</th>
                    <th className="px-5 py-4 font-medium">Moves</th>
                    <th className="px-5 py-4 font-medium">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredGames.map((game) => {
                    const isSelected = selectedGame?.id === game.id;

                    return (
                      <tr
                        key={game.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedGameId(game.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedGameId(game.id);
                          }
                        }}
                        aria-pressed={isSelected}
                        className={`cursor-pointer border-l-2 border-l-transparent transition duration-200 focus:outline-none focus-visible:bg-purple-500/10 hover:bg-purple-500/[0.06] ${
                          isSelected
                            ? "border-l-purple-400 bg-purple-500/10 shadow-[inset_0_0_0_1px_rgba(168,85,247,0.22)]"
                            : ""
                        }`}
                      >
                        <td className="px-5 py-4 text-slate-300">{game.color}</td>
                        <td className="px-5 py-4 font-medium text-white">{game.opponent}</td>
                        <td className="px-5 py-4">
                          <ResultBadge result={game.result} />
                        </td>
                        <td className="px-5 py-4 text-slate-300">{game.timeControl}</td>
                        <td className="px-5 py-4 text-slate-400">{game.rated}</td>
                        <td className="max-w-56 truncate px-5 py-4 text-slate-400">
                          {game.opening}
                        </td>
                        <td className="px-5 py-4 text-slate-400">{game.date}</td>
                        <td className="px-5 py-4 text-slate-300">{game.moves}</td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedGameId(game.id);
                            }}
                            className="rounded-lg bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300 transition duration-200 hover:bg-purple-500 hover:text-white"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredGames.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                No Chess.com games match these filters.
              </div>
            )}

            <div className="border-t border-white/10 px-5 py-4">
              {hasMoreGames ? (
                <button
                  type="button"
                  onClick={onLoadGames}
                  disabled={isLoadingGames}
                  className="w-full rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition duration-200 hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingGames ? "Loading more games..." : "Load more games"}
                </button>
              ) : (
                <div className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-center text-sm text-slate-400">
                  No more games
                </div>
              )}
            </div>
          </Card>

          <div className="grid gap-6">
            <Card className="p-6">
              <p className="text-sm font-medium text-purple-300">Selected game</p>
              {selectedGame ? (
                <>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    vs {selectedGame.opponent}
                  </h2>

                  <div className="mt-5 grid gap-3 text-sm">
                    {[
                      ["Result", selectedGame.result],
                      ["Raw result", selectedGame.rawResult],
                      ["Opening", selectedGame.opening],
                      ["Time control", selectedGame.timeControl],
                      ["Rated", selectedGame.rated],
                      ["Moves", selectedGame.moves],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 rounded-xl bg-slate-950/50 px-4 py-3">
                        <span className="text-slate-500">{label}</span>
                        <span className="text-right font-medium text-slate-200">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3">
                    <a
                      href={selectedGame.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-purple-500/40 hover:bg-purple-500/10"
                    >
                      Open on Chess.com
                    </a>
                    <button
                      type="button"
                      className="rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition duration-200 hover:bg-purple-400"
                    >
                      Review placeholder
                    </button>
                  </div>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-400">Select a game to review later.</p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white">Pattern Insights</h2>
              <div className="mt-5 grid gap-3">
                {insights.map((insight) => (
                  <div
                    key={insight}
                    className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4 text-sm leading-6 text-purple-100"
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
