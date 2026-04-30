import { Chess } from "chess.js";
import { useMemo, useState } from "react";
import MoveControls from "../components/review/MoveControls";
import ReviewBoard from "../components/review/ReviewBoard";
import ReviewPanel from "../components/review/ReviewPanel";
import ReviewPlayerBar from "../components/review/ReviewPlayerBar";
import type { ReviewMove } from "../components/review/ReviewMoveList";
import "../styles/gameReview.css";

type GameReviewPageProps = {
  gameId?: string;
  pgn?: string;
  players?: {
    white?: string;
    black?: string;
  };
};

const fallbackPgn = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5";

export default function GameReviewPage({ gameId, pgn, players }: GameReviewPageProps) {
  const activePgn = pgn ?? fallbackPgn;

  const replayData = useMemo(() => {
    const parser = new Chess();
    parser.loadPgn(activePgn);
    const history = parser.history();
    const replay = new Chess();
    const builtMoves: ReviewMove[] = [];
    const fens: string[] = [replay.fen()];

    history.forEach((san) => {
      replay.move(san);
      builtMoves.push({ san, fen: replay.fen() });
      fens.push(replay.fen());
    });

    return { builtMoves, fens };
  }, [activePgn]);

  const [game, setGame] = useState(() => new Chess());
  const [currentFen, setCurrentFen] = useState(game.fen());
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [activeTab, setActiveTab] = useState<"report" | "analysis" | "coach">("analysis");

  const jumpToIndex = (index: number) => {
    const safeIndex = Math.max(0, Math.min(index, replayData.fens.length - 1));
    const next = new Chess();

    for (let i = 0; i < safeIndex; i += 1) {
      next.move(replayData.builtMoves[i].san);
    }

    setGame(next);
    setCurrentFen(next.fen());
    setCurrentMoveIndex(safeIndex);
  };

  const handleMove = (source: string, target: string) => {
    const next = new Chess(game.fen());
    const move = next.move({ source, target, promotion: "q" });
    if (!move) return false;

    setGame(next);
    setCurrentFen(next.fen());
    setCurrentMoveIndex(next.history().length);
    return true;
  };

  const resetGame = () => {
    const fresh = new Chess();
    setGame(fresh);
    setCurrentFen(fresh.fen());
    setCurrentMoveIndex(0);
  };

  const report = {
    white: players?.white ?? "AuraPlayer",
    black: players?.black ?? "Opponent",
    accuracy: "87%",
    rating: "1820",
    inaccuracies: 3,
    mistakes: 1,
    blunders: 0,
  };

  const gameInfo = {
    result: "1-0",
    timeControl: "Rapid 10+0",
    date: "Apr 30, 2026",
  };

  return (
    <div className="game-review-page">
      <div className="game-review-layout">
        <section className="game-review-board-card">
         

          <ReviewPlayerBar name={report.black} rating={1810} color="black" />
          <ReviewBoard fen={currentFen} orientation={orientation} onMove={handleMove} />
          <ReviewPlayerBar name={report.white} rating={1840} color="white" />

         
        </section>

        <aside>
          <ReviewPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            report={report}
            gameInfo={gameInfo}
            moves={replayData.builtMoves}
            currentMoveIndex={currentMoveIndex}
            onSelectMove={jumpToIndex}
          />
           <MoveControls
            onPrev={() => jumpToIndex(currentMoveIndex - 1)}
            onNext={() => jumpToIndex(currentMoveIndex + 1)}
            onReset={resetGame}
            onFlip={() => setOrientation((prev) => (prev === "white" ? "black" : "white"))}
          />
        </aside>
      </div>
    </div>
  );
}
