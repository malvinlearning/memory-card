import "./styles/modal.css"; // Import styles for the modal

export default function Modal({ status, onPlayAgain }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{status === "win" ? "🎉 You Won!" : "😢 You Lost!"}</h2>
        <button onClick={onPlayAgain} className="play-again-btn">
          Play Again
        </button>
      </div>
    </div>
  );
}
