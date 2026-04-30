import CoachInsightPanel from "./CoachInsightPanel";
import ReviewMoveList, { type ReviewMove } from "./ReviewMoveList";

type ReviewReport = {
  white: string;
  black: string;
  accuracy: string;
  rating: string;
  inaccuracies: number;
  mistakes: number;
  blunders: number;
};

type ReviewGameInfo = {
  result: string;
  timeControl: string;
  date: string;
};

type ReviewPanelProps = {
  activeTab: "report" | "analysis" | "coach";
  onTabChange: (tab: "report" | "analysis" | "coach") => void;
  report: ReviewReport;
  gameInfo: ReviewGameInfo;
  moves: ReviewMove[];
  currentMoveIndex: number;
  onSelectMove: (index: number) => void;
};

export default function ReviewPanel({
  activeTab,
  onTabChange,
  report,
  gameInfo,
  moves,
  currentMoveIndex,
  onSelectMove,
}: ReviewPanelProps) {
  const summaryPairs = [
    ["Accuracy", report.accuracy],
    ["Rating", report.rating],
    ["Inaccuracies", String(report.inaccuracies)],
    ["Mistakes", String(report.mistakes)],
    ["Blunders", String(report.blunders)],
  ];

  return (
    <aside className="game-review-panel">
      <h2 className="game-review-panel-title">Game Review</h2>
      <p className="game-review-panel-subtitle">Analyze key moments and train better decisions.</p>

      <hr className="game-review-divider" />

      <div className="game-review-tabs">
        {[
          ["report", "Report"],
          ["analysis", "Analysis"],
          ["coach", "Coach AI"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key as "report" | "analysis" | "coach")}
            className={`game-review-tab ${activeTab === key ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "16px", display: "grid", gap: "16px" }}>
        <section className="game-review-card">
          <p className="game-review-card-title">Game Header</p>
          <div className="game-review-info-grid">
            <p><span className="game-review-label">Players:</span> <span className="game-review-value">{report.white} vs {report.black}</span></p>
            <p><span className="game-review-label">Result:</span> <span className="game-review-value">{gameInfo.result}</span></p>
            <p><span className="game-review-label">Time Control:</span> <span className="game-review-value">{gameInfo.timeControl}</span></p>
            <p><span className="game-review-label">Date:</span> <span className="game-review-value">{gameInfo.date}</span></p>
          </div>
        </section>

        {activeTab === "report" && (
          <>
            <section className="game-review-card">
              <p className="game-review-card-title">Review Summary</p>
              <div className="game-review-summary-grid">
                {summaryPairs.map(([label, value]) => (
                  <div key={label} className="game-review-card">
                    <p className="game-review-label">{label}</p>
                    <p className="game-review-value">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="game-review-card">
              <p className="game-review-card-title">Evaluation / Feedback</p>
              <div className="game-review-pills">
                <span className="game-review-pill best">Best move</span>
                <span className="game-review-pill inaccuracy">Inaccuracy</span>
                <span className="game-review-pill mistake">Mistake</span>
                <span className="game-review-pill blunder">Blunder</span>
              </div>
            </section>
          </>
        )}

        {activeTab === "analysis" && (
          <ReviewMoveList
            moves={moves}
            currentMoveIndex={currentMoveIndex}
            onSelectMove={onSelectMove}
          />
        )}

        {activeTab === "coach" && <CoachInsightPanel />}

        <div className="game-review-action-buttons">
          <button type="button" className="game-review-action-btn primary">Train this position</button>
          <button type="button" className="game-review-action-btn secondary">Send to AI Coach</button>
        </div>
      </div>
    </aside>
  );
}
