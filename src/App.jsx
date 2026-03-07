import { useState, useEffect, useRef } from 'react';

const level1Map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 3, 1],
  [1, 0, 1, 0, 0, 2, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 4, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 2, 2, 1, 1, 0, 0, 1, 1, 1, 4, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 2, 2, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 2, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 3, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function App() {
  const [gameState, setGameState] = useState('START');
  const [playerPosition, setPlayerPosition] = useState({ r: 1, c: 1 });
  const [grid, setGrid] = useState(level1Map);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const movePlayer = (direction) => {
    if (gameState !== 'PLAYING') return;
    setPlayerPosition((prev) => {
      let { r, c } = prev;
      if (direction === 'up') r -= 1;
      if (direction === 'down') r += 1;
      if (direction === 'left') c -= 1;
      if (direction === 'right') c += 1;

      if (grid[r][c] === 1 || grid[r][c] === 2) return prev; 

      if (grid[r][c] === 3 || grid[r][c] === 4) {
        const newScore = score + 10;
        setScore(newScore);
        if (newScore === 40) setGameState('WON');
        const newGrid = [...grid];
        newGrid[r] = [...newGrid[r]];
        newGrid[r][c] = 0;
        setGrid(newGrid);
      }
      return { r, c };
    });
  };

  const resetGame = () => {
    setScore(0); setTimer(0);
    setPlayerPosition({ r: 1, c: 1 });
    setGrid(level1Map);
    setGameState('PLAYING');
  };

  if (gameState === 'START' || gameState === 'WON') {
    return (
      <div style={fullScreenCenter}>
        <div style={cardStyle}>
          <h1 style={{fontSize: '2.5rem', margin: '0 0 10px 0'}}>GEO SPY 🕵️‍♂️</h1>
          {gameState === 'WON' && <h2 style={{color: '#4CAF50'}}>SUCCESS! ⏱ {timer}s</h2>}
          <button onClick={resetGame} style={primaryBtn}>
            {gameState === 'START' ? 'START MISSION' : 'RETRY'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={gameLayout}>
      {/* HUD (Heads Up Display) */}
      <div style={hudStyle}>
        <span>⭐ {score}/40</span>
        <span>⏱ {timer}s</span>
      </div>
      
      {/* Responsive Grid Container */}
      <div style={gridWrapper}>
        <div style={gridStyle}>
          {grid.map((row, rIdx) => row.map((cell, cIdx) => {
            let bg = '#81c784'; let content = '';
            if (cell === 1) { bg = '#388e3c'; content = '🌴'; }
            if (cell === 2) { bg = '#0288d1'; content = '🌊'; }
            if (cell === 3) content = '🇨🇴';
            if (cell === 4) content = '🇩🇴';
            if (rIdx === playerPosition.r && cIdx === playerPosition.c) content = '🐈';
            return <div key={`${rIdx}-${cIdx}`} style={{...tileStyle, backgroundColor: bg}}>{content}</div>;
          }))}
        </div>
      </div>

      {/* MOBILE OPTIMIZED D-PAD */}
      <div style={dPadWrapper}>
        <div style={dPadGrid}>
          <div /> <button onPointerDown={() => movePlayer('up')} style={dirBtn}>▲</button> <div />
          <button onPointerDown={() => movePlayer('left')} style={dirBtn}>◀</button> 
          <div style={centerDot} /> 
          <button onPointerDown={() => movePlayer('right')} style={dirBtn}>▶</button>
          <div /> <button onPointerDown={() => movePlayer('down')} style={dirBtn}>▼</button> <div />
        </div>
      </div>
    </div>
  );
}

// --- MOBILE OPTIMIZED STYLES ---
const fullScreenCenter = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#1a2a6c', fontFamily: 'sans-serif' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', width: '80%', maxWidth: '400px' };
const primaryBtn = { background: '#4CAF50', color: 'white', border: 'none', padding: '15px 30px', fontSize: '1.2rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' };

const gameLayout = { display: 'flex', flexDirection: 'column', height: '100vh', background: '#2a5298', fontFamily: 'sans-serif', overflow: 'hidden' };
const hudStyle = { display: 'flex', justifyContent: 'space-around', padding: '15px', background: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', fontWeight: 'bold' };

const gridWrapper = { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2px', background: '#3e2723', padding: '4px', borderRadius: '8px', maxWidth: '100%', aspectRatio: '1/1' };
const tileStyle = { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 'min(4vw, 20px)', aspectRatio: '1/1', borderRadius: '2px' };

const dPadWrapper = { height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderTop: '2px solid rgba(255,255,255,0.1)' };
const dPadGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 70px)', gridTemplateRows: 'repeat(3, 70px)', gap: '5px' };
const dirBtn = { width: '70px', height: '70px', borderRadius: '15px', border: 'none', background: '#f0f0f0', fontSize: '24px', fontWeight: 'bold', boxShadow: '0 4px #ccc', cursor: 'pointer', userSelect: 'none', touchAction: 'none' };
const centerDot = { width: '70px', height: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center' };

export default App;