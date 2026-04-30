type ReviewPlayerBarProps = {
  name: string;
  rating: number;
  color: "white" | "black";
};

export default function ReviewPlayerBar({ name, rating, color }: ReviewPlayerBarProps) {
  return (
    <div className="game-review-player-bar">
      <div className="game-review-player-meta">
        <p className="game-review-player-color">{color === "white" ? "White" : "Black"}</p>
        <p className="game-review-player-name">{name}</p>
      </div>
      <span className="game-review-player-rating">{rating}</span>
    </div>
  );
}
