import { useState, useEffect, useRef } from 'react';

// --- DATA: MISSION 1 (COL) & MISSION 2 (DR) ---
const missions = {
  1: {
    title: "MISSION 1: COLOMBIA RECON 🇨🇴",
    goalScore: 30,
    gridSize: 10,
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 4, 1],
      [1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
      [1, 4, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 4, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 4, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  },
  2: {
    title: "MISSION 2: DOMINICAN REPUBLIC 🇩🇴",
    goalScore: 40,
    gridSize: 15,
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 0, 4, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 2, 0, 0, 1],
      [1, 0, 0, 3, 0, 0, 0, 1, 1, 1, 0, 2, 2, 0, 1],
      [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 3, 1, 0, 1],
      [1, 0, 0, 1, 2, 0, 2, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 1, 0, 1, 2, 4, 2, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 2, 2, 2, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 2, 2, 0, 0, 0, 3, 0, 1, 1, 1, 0, 0, 4, 1],
      [1, 4, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  }
};

const ASSETS = {
  SPRITES: '/assets/characters/level1_sprites.png',
  DASHBOARD: '/assets/ui/level1_dashboard.png',
  FLAG_DR: "https://flagcdn.com/w80/do.png",
  FLAG_CO: "https://flagcdn.com/w80/co.png"
};

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState('START');
  const [playerPosition, setPlayerPosition] = useState({ r: 1, c: 1 });
  const [grid, setGrid] = useState(missions[1].map);
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

  // --- THE FIX: Robust Level Transitions ---
  const loadMission = (levelNum) => {
    const data = missions[levelNum];
    setCurrentLevel(levelNum);
    setScore(0);
    setTimer(0);
    setPlayerPosition({ r: 1, c: 1 });
    setGrid(data.map.map(row => [...row])); // Clean reset
    setGameState('PLAYING');
  };

  const movePlayer = (direction) => {
    if (gameState !== 'PLAYING') return;
    setPlayerPosition((prev) => {
      let { r, c } = prev;
      if (direction === 'up') r -= 1;
      if (direction === 'down') r += 1;
      if (direction === 'left') c -= 1;
      if (direction === 'right') c += 1;

      if (grid[r][c] === 1) return prev; 
      if (currentLevel === 2 && grid[r][c] === 3) { setGameState('FAILED'); return prev; }
      
      if (grid[r][c] === 4) {
        const newScore = score + 10;
        setScore(newScore);
        if (newScore >= missions[currentLevel].goalScore) setGameState('WON');
        const newGrid = [...grid];
        newGrid[r] = [...newGrid[r]];
        newGrid[r][c] = 0;
        setGrid(newGrid);
      }
      return { r, c };
    });
  };

  // --- OVERLAY LOGIC ---
  if (gameState !== 'PLAYING') {
    return (
      <div style={fullScreenCenter}>
        <div style={cardStyle}>
          <h1 style={{margin: '0 0 10px 0'}}>
            {gameState === 'WON' ? 'MISSION SUCCESS!' : gameState === 'FAILED' ? 'MISSION FAILED!' : 'GEO SPY: MOBILE'}
          </h1>
          
          <div style={btnGroup}>
            {gameState === 'START' && (
              <button onClick={() => loadMission(1)} style={spyBtn}>START MISSION 1</button>
            )}
            
            {gameState === 'WON' && currentLevel === 1 && (
              <button onClick={() => loadMission(2)} style={spyBtn}>GO TO MISSION 2 🇩🇴</button>
            )}

            {(gameState === 'FAILED' || (gameState === 'WON' && currentLevel === 2)) && (
              <button onClick={() => loadMission(currentLevel)} style={spyBtn}>RETRY MISSION</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={gameLayout}>
      <div style={dashboardHeader}>
        <div style={hudWrapper}>
           <div style={glassHUD}>⭐ {score}/{missions[currentLevel].goalScore}</div>
           <div style={glassHUD}>⏱ {timer}s</div>
        </div>
      </div>
      
      <div style={gridWrapper}>
        <div style={gridStyle(missions[currentLevel].gridSize)}>
          {grid.map((row, rIdx) => row.map((cell, cIdx) => {
            let bg = cell === 1 ? '#388e3c' : cell === 2 ? '#0288d1' : '#81c784';
            let content = null;
            if (cell === 3) content = <img src={ASSETS.FLAG_CO} style={tileFlag} alt="CO" />;
            if (cell === 4) {
                content = currentLevel === 1 
                  ? <img src={ASSETS.FLAG_CO} style={tileFlag} alt="Target" /> 
                  : <div style={hutSprite} />;
            }
            if (rIdx === playerPosition.r && cIdx === playerPosition.c) {
              content = <div style={{...catSprite, opacity: grid[rIdx][cIdx] === 2 ? 0.6 : 1}} />;
            }
            return <div key={`${rIdx}-${cIdx}`} style={{...tileStyle, backgroundColor: bg}}>{content}</div>;
          }))}
        </div>
      </div>

      <div style={dashboardFooter}>
        <div style={dPadGrid}>
          <div /> <button onPointerDown={() => movePlayer('up')} style={dirBtn}>▲</button> <div />
          <button onPointerDown={() => movePlayer('left')} style={dirBtn}>◀</button> 
          <div style={compassCenter}>🧭</div> 
          <button onPointerDown={() => movePlayer('right')} style={dirBtn}>▶</button>
          <div /> <button onPointerDown={() => movePlayer('down')} style={dirBtn}>▼</button> <div />
        </div>
      </div>
    </div>
  );
}

// --- STYLES (CENTERED & OPTIMIZED) ---
const gameLayout = { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#3a7bd5', overflow: 'hidden', position: 'fixed', top: 0, left: 0 };
const dashboardHeader = { flexShrink: 0, height: '15vh', minHeight: '100px', backgroundImage: `url(${ASSETS.DASHBOARD})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '15px' };
const gridWrapper = { flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' };
const dashboardFooter = { flexShrink: 0, height: '35vh', minHeight: '220px', backgroundImage: `url(${ASSETS.DASHBOARD})`, backgroundSize: '100% 100%', backgroundPosition: '0% 48%', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const gridStyle = (size) => ({ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: '1px', background: '#3e2723', width: '100%', maxWidth: 'min(90vw, 40vh)', aspectRatio: '1/1' });
const fullScreenCenter = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#3a7bd5' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '25px', textAlign: 'center', width: '85%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' };
const btnGroup = { display: 'flex', flexDirection: 'column', gap: '15px' };
const spyBtn = { background: '#222', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' };
const catSprite = { width: '100%', height: '100%', backgroundImage: `url(${ASSETS.SPRITES})`, backgroundSize: '400% 200%', backgroundPosition: '0% 0%', backgroundRepeat: 'no-repeat' };
const hutSprite = { width: '100%', height: '100%', backgroundImage: `url(${ASSETS.SPRITES})`, backgroundSize: '400% 200%', backgroundPosition: '100% 0%', backgroundRepeat: 'no-repeat' };
const tileStyle = { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const tileFlag = { width: '80%', height: 'auto' };
const hudWrapper = { display: 'flex', gap: '10px' };
const glassHUD = { background: 'rgba(255,255,255,0.3)', padding: '5px 15px', borderRadius: '20px', color: 'white', fontWeight: 'bold' };
const dPadGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: '10px' };
const dirBtn = { width: '60px', height: '60px', borderRadius: '15px', background: '#eee', fontSize: '24px', fontWeight: 'bold', border: 'none', boxShadow: '0 4px #bbb' };
const compassCenter = { width: '60px', height: '60px', background: '#FFD700', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' };

export default App;