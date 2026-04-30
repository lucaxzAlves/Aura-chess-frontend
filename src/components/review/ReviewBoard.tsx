import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";

type ReviewBoardProps = {
  fen: string;
  orientation: "white" | "black";
  onMove: (source: string, target: string) => boolean;
};

export default function ReviewBoard({ fen, orientation, onMove }: ReviewBoardProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [boardWidth, setBoardWidth] = useState(620);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const syncBoardWidth = () => {
      const width = wrapperRef.current?.clientWidth ?? 620;
      const max = Math.min(width, 680);
      const min = window.innerWidth > 1100 ? 560 : 280;
      setBoardWidth(Math.max(min, Math.floor(max)));
    };

    syncBoardWidth();
    const observer = new ResizeObserver(syncBoardWidth);
    observer.observe(wrapperRef.current);
    window.addEventListener("resize", syncBoardWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncBoardWidth);
    };
  }, []);

  return (
    <div className="game-review-board-shell">
      <div ref={wrapperRef} className="game-review-board-wrapper">
        <Chessboard
          id="game-review-board"
          position={fen}
          boardWidth={boardWidth}
          boardOrientation={orientation}
          customDarkSquareStyle={{ backgroundColor: "#4c1d95" }}
          customLightSquareStyle={{ backgroundColor: "#ddd6fe" }}
          areArrowsAllowed={false}
          showBoardNotation
          onPieceDrop={(sourceSquare, targetSquare) => {
            if (!targetSquare) return false;
            return onMove(sourceSquare, targetSquare);
          }}
        />
      </div>
    </div>
  );
}
