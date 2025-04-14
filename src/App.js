import React, { useEffect, useState } from 'react';
import './App.css';

const emojiList = ['🍕', '🎮', '🐶', '🚀', '🌈', '🎵', '🧠', '🏀'];

const flipSound = new Audio('/sounds/flip.mp3');
const matchSound = new Audio('/sounds/match.mp3');
const winSound = new Audio('/sounds/win.mp3');

function App() {
  const [previewing, setPreviewing] = useState(true);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  

  // Shuffle cards on first render
  useEffect(() => {
    initializeCards();
  }, []);

  // Start timer
  useEffect(() => {
    let timer;
    if (!gameOver) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameOver]);

  const initializeCards = () => {
    const shuffled = [...emojiList, ...emojiList]
      .map((emoji) => ({ id: Math.random(), emoji, matched: false }))
      .sort(() => Math.random() - 0.5);
  
    setCards(shuffled);
    setFlipped(shuffled); // show all cards
    setDisabled(true);
    setMoves(0);
    setTime(0);
    setGameOver(false);
    setPreviewing(true);
  
    // Hide all after 3 seconds
    setTimeout(() => {
      setFlipped([]);
      setDisabled(false);
      setPreviewing(false);
    }, 3000);
  };

  const handleCardClick = (card) => {
    if (disabled || previewing || flipped.includes(card) || card.matched) return;

    flipSound.play();
    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves((m) => m + 1);

      setTimeout(() => {
        const [first, second] = newFlipped;

        if (first.emoji === second.emoji) {
          matchSound.play();
          setCards((prev) =>
            prev.map((c) =>
              c.emoji === first.emoji ? { ...c, matched: true } : c
            )
          );

          const allMatched = cards.every(
            (c) =>
              c.emoji === first.emoji ? true : c.matched
          );

          if (allMatched) {
            setGameOver(true);
            winSound.play();
          }
        }

        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  return (
    <div className="app">
      <h1>Memory Match Game</h1>
      <div className="status-bar">
        <p>Moves: {moves} | Time: {time}s</p>
        <button onClick={initializeCards}>Restart</button>
      </div>

      <div className="grid">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card) || card.matched;
          return (
            <div
              key={card.id}
              className={`card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              {isFlipped ? card.emoji : "?"}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div className="popup">
          <h2>🎉 You Win!</h2>
          <p>Moves: {moves}</p>
          <p>Time: {time} seconds</p>
          <button onClick={initializeCards}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
