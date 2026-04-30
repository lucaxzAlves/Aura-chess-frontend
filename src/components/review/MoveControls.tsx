type MoveControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onFlip: () => void;
};

function ControlButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="game-review-control-button">
      {label}
    </button>
  );
}

export default function MoveControls({ onPrev, onNext, onReset, onFlip }: MoveControlsProps) {
  return (
    <div className="game-review-controls">
      <ControlButton label="Previous" onClick={onPrev} />
      <ControlButton label="Next" onClick={onNext} />
      <ControlButton label="Reset" onClick={onReset} />
      <ControlButton label="Flip" onClick={onFlip} />
    </div>
  );
}
