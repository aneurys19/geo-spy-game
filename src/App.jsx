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

const FLAG_CO = "https://flagcdn.com/w80/co.png";
const FLAG_DR = "https://flagcdn.com/w80/do.png";

function App() {
  // States: START, MISSION_POPUP, PLAYING, WON, FAILED
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

      if (grid[r][c] === 4) { setGameState('FAILED'); return prev; }
      if (grid[r][c] === 3) {
        const newScore = score + 20;
        setScore(newScore);
        if (newScore >= 40) setGameState('WON');
        const newGrid = [...grid];
        newGrid[r] = [...newGrid[r]];
        newGrid[r][c] = 0;
        setGrid(newGrid);
      }
      return { r, c };
    });
  };

  const startMissionLogic = () => {
    setScore(0); setTimer(0);
    setPlayerPosition({ r: 1, c: 1 });
    setGrid(level1Map);
    setGameState('MISSION_POPUP'); // Show the big instruction first
  };

  // --- OVERLAY SCREENS ---
  if (gameState !== 'PLAYING') {
    let content;
    if (gameState === 'START') {
      content = (
        <div style={cardStyle}>
          <h1 style={titleStyle}>GEO SPY 🕵️‍♂️</h1>
          <button onClick={startMissionLogic} style={primaryBtn}>START GAME</button>
        </div>
      );
    } else if (gameState === 'MISSION_POPUP') {
      content = (
        <div style={{...cardStyle, border: '5px solid #FFD700'}}>
          <h2 style={{color: '#1a2a6c'}}>MISSION BRIEFING</h2>
          <img src={FLAG_CO} width="100" style={{margin: '20px 0', borderRadius: '8px'}} alt="Target" />
          <p style={{fontSize: '1.4rem', fontWeight: 'bold'}}>FIND THE COLOMBIAN FLAGS!</p>
          <p style={{color: '#666'}}>Do not touch any other flags, or the mission resets!</p>
          <button onClick={() => setGameState('PLAYING')} style={primaryBtn}>I'M READY!</button>
        </div>
      );
    } else if (gameState === 'WON' || gameState === 'FAILED') {
      const isWon = gameState === 'WON';
      content = (
        <div style={cardStyle}>
          <h1 style={{color: isWon ? '#2e7d32' : '#c62828'}}>{isWon ? 'MISSION CLEAR! 🎉' : 'MISSION FAILED! ❌'}</h1>
          <p>{isWon ? `Time: ${timer}s` : 'You grabbed the wrong flag!'}</p>
          <button onClick={startMissionLogic} style={primaryBtn}>{isWon ? 'PLAY AGAIN' : 'TRY AGAIN'}</button>
        </div>
      );
    }

    return <div style={fullScreenCenter}>{content}</div>;
  }

  // --- GAMEPLAY RENDER ---
  return (
    <div style={gameLayout}>
      <div style={hudStyle}><span>⭐ {score}/40</span><span>⏱ {timer}s</span></div>
      <div style={gridWrapper}>
        <div style={gridStyle}>
          {grid.map((row, rIdx) => row.map((cell, cIdx) => {
            let bg = '#81c784'; let item = null;
            if (cell === 1) { bg = '#388e3c'; item = '🌴'; }
            if (cell === 2) { bg = '#0288d1'; item = '🌊'; }
            if (cell === 3) item = <img src={FLAG_CO} style={flagStyle} />;
            if (cell === 4) item = <img src={FLAG_DR} style={flagStyle} />;
            if (rIdx === playerPosition.r && cIdx === playerPosition.c) item = '🐈';
            return <div key={`${rIdx}-${cIdx}`} style={{...tileStyle, backgroundColor: bg}}>{item}</div>;
          }))}
        </div>
      </div>
      <div style={dPadWrapper}>
        <div style={dPadGrid}>
          <div /> <button onPointerDown={() => movePlayer('up')} style={dirBtn}>▲</button> <div />
          <button onPointerDown={() => movePlayer('left')} style={dirBtn}>◀</button> 
          <div /> 
          <button onPointerDown={() => movePlayer('right')} style={dirBtn}>▶</button>
          <div /> <button onPointerDown={() => movePlayer('down')} style={dirBtn}>▼</button> <div />
        </div>
      </div>
    </div>
  );
}

// --- UPDATED STYLES ---
const fullScreenCenter = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#1a2a6c', fontFamily: 'sans-serif' };
const cardStyle = { background: 'white', padding: '30px', borderRadius: '24px', textAlign: 'center', width: '85%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'popIn 0.3s ease-out' };
const titleStyle = { fontSize: '2.5rem', marginBottom: '20px', color: '#1e3c72' };
const primaryBtn = { background: '#222', color: 'white', border: 'none', padding: '15px 30px', fontSize: '1.2rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const gameLayout = { display: 'flex', flexDirection: 'column', height: '100vh', background: '#2a5298', fontFamily: 'sans-serif', overflow: 'hidden' };
const hudStyle = { display: 'flex', justifyContent: 'space-around', padding: '10px', background: 'white', fontWeight: 'bold' };
const gridWrapper = { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2px', background: '#3e2723', padding: '4px', borderRadius: '8px', width: '100%', maxWidth: '500px', aspectRatio: '1/1' };
const tileStyle = { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', aspectRatio: '1/1' };
const flagStyle = { width: '80%', height: 'auto' };
const dPadWrapper = { height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.2)' };
const dPadGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 70px)', gridTemplateRows: 'repeat(3, 70px)', gap: '5px' };
const dirBtn = { width: '70px', height: '70px', borderRadius: '15px', border: 'none', background: '#f0f0f0', fontSize: '24px', fontWeight: 'bold', boxShadow: '0 4px #ccc' };

export default App;