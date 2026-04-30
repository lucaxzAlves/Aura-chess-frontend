export type ReviewMove = {
  san: string;
  fen: string;
  annotation?: "?!" | "?" | "??";
};

type ReviewMoveListProps = {
  moves: ReviewMove[];
  currentMoveIndex: number;
  onSelectMove: (index: number) => void;
};

export default function ReviewMoveList({
  moves,
  currentMoveIndex,
  onSelectMove,
}: ReviewMoveListProps) {
  return (
    <div className="game-review-move-list">
      <div className="game-review-move-head">
        <span>#</span>
        <span>White</span>
        <span>Black</span>
      </div>

      <div className="game-review-move-scroll">
        {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, rowIndex) => {
          const whiteIndex = rowIndex * 2;
          const blackIndex = whiteIndex + 1;
          const whiteMove = moves[whiteIndex];
          const blackMove = moves[blackIndex];

          return (
            <div key={`row-${rowIndex}`} className="game-review-move-row">
              <span className="game-review-move-index">{rowIndex + 1}.</span>

              <button
                type="button"
                onClick={() => onSelectMove(whiteIndex + 1)}
                className={`game-review-move-btn ${
                  currentMoveIndex === whiteIndex + 1 ? "active" : ""
                }`}
              >
                {whiteMove ? `${whiteMove.san}${whiteMove.annotation ?? ""}` : "-"}
              </button>

              <button
                type="button"
                disabled={!blackMove}
                onClick={() => onSelectMove(blackIndex + 1)}
                className={`game-review-move-btn ${
                  currentMoveIndex === blackIndex + 1 ? "active" : ""
                }`}
              >
                {blackMove ? `${blackMove.san}${blackMove.annotation ?? ""}` : "-"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
