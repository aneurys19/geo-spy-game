import { useState, useEffect, useRef } from 'react';

// --- GAME DATA: Level 2 ---
const level2Map = [
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
];

const ASSETS = {
  SPRITES: '/assets/characters/level1_sprites.png',
  DASHBOARD: '/assets/ui/level1_dashboard.png',
  FLAG_DR: "https://flagcdn.com/w80/do.png",
  FLAG_CO: "https://flagcdn.com/w80/co.png"
};

function App() {
  const [gameState, setGameState] = useState('START');
  const [playerPosition, setPlayerPosition] = useState({ r: 1, c: 1 });
  const [grid, setGrid] = useState(level2Map);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);

  const movePlayer = (direction) => {
    if (gameState !== 'PLAYING') return;
    setPlayerPosition((prev) => {
      let { r, c } = prev;
      if (direction === 'up') r -= 1;
      if (direction === 'down') r += 1;
      if (direction === 'left') c -= 1;
      if (direction === 'right') c += 1;
      if (grid[r][c] === 1) return prev; 
      if (grid[r][c] === 3) { setGameState('FAILED'); return prev; }
      if (grid[r][c] === 4) {
        const newScore = score + 10;
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

  // --- OVERLAYS ---
  if (gameState !== 'PLAYING') {
    return (
      <div style={fullScreenCenter}>
        <div style={cardStyle}>
          <h1 style={{margin: '0 0 20px 0'}}>GEO SPY: DR</h1>
          <div style={startFlex}>
            <img src={ASSETS.FLAG_DR} style={startFlag} alt="DR Flag" />
            <button onClick={() => setGameState('MISSION_POPUP')} style={spyBtn}>START MISSION</button>
          </div>
        </div>

        {gameState === 'MISSION_POPUP' && (
          <div style={briefingOverlay}>
             <div style={briefingCard}>
                <h2>MISSION START</h2>
                <p>Find the Huts, stay away from Colombia!</p>
                <button onClick={() => setGameState('PLAYING')} style={spyBtn}>GO!</button>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={gameLayout}>
      <div style={dashboardHeader}>
        <div style={hudWrapper}>
           <div style={glassHUD}>⭐ {score}/40</div>
           <div style={glassHUD}>⏱ {timer}s</div>
        </div>
      </div>
      
      <div style={gridWrapper}>
        <div style={gridStyle}>
          {grid.map((row, rIdx) => row.map((cell, cIdx) => {
            let bg = '#81c784'; let content = null;
            if (cell === 1) bg = '#388e3c'; 
            if (cell === 2) bg = '#0288d1';
            if (cell === 3) content = <img src={ASSETS.FLAG_CO} style={tileFlag} alt="CO Flag" />;
            if (cell === 4) content = <div style={hutSprite} />;
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

// --- SPRITE POSITIONING ---
const catSprite = { 
  width: '100%', height: '100%', 
  backgroundImage: `url(${ASSETS.SPRITES})`, 
  backgroundSize: '400% 200%', 
  backgroundPosition: '0% 0%', 
  backgroundRepeat: 'no-repeat' 
};

const hutSprite = { 
  width: '100%', height: '100%', 
  backgroundImage: `url(${ASSETS.SPRITES})`, 
  backgroundSize: '400% 200%', 
  backgroundPosition: '100% 0%', 
  backgroundRepeat: 'no-repeat' 
};

// --- STYLES ---
const fullScreenCenter = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(180deg, #3a7bd5 0%, #00d2ff 100%)', fontFamily: 'sans-serif' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '85%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' };
const startFlex = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' };
const startFlag = { width: '120px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' };
const briefingOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 };
const briefingCard = { background: '#FFD700', padding: '40px', borderRadius: '25px', textAlign: 'center', border: '6px solid #b8860b' };
const spyBtn = { background: '#222', color: 'white', border: 'none', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' };

const gameLayout = { display: 'flex', flexDirection: 'column', height: '100vh', background: '#3a7bd5' };
const dashboardHeader = { height: '120px', backgroundImage: `url(${ASSETS.DASHBOARD})`, backgroundSize: '100% auto', backgroundPosition: '0% 0%', backgroundRepeat: 'no-repeat', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '20px' };
const hudWrapper = { display: 'flex', gap: '15px' };
const glassHUD = { background: 'rgba(255,255,255,0.3)', padding: '5px 15px', borderRadius: '20px', color: 'white', fontWeight: 'bold' };
const dashboardFooter = { height: '260px', backgroundImage: `url(${ASSETS.DASHBOARD})`, backgroundSize: '100% auto', backgroundPosition: '0% 48%', backgroundRepeat: 'no-repeat', display: 'flex', justifyContent: 'center', alignItems: 'center' };

const gridWrapper = { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: '1px', background: '#3e2723', width: '95vw', maxWidth: '480px', aspectRatio: '1/1' };
const tileStyle = { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' };
const tileFlag = { width: '80%', height: 'auto' };

const dPadGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 70px)', gridTemplateRows: 'repeat(3, 70px)', gap: '8px' };
const dirBtn = { width: '70px', height: '70px', borderRadius: '15px', border: 'none', background: '#eee', fontSize: '24px', fontWeight: 'bold', boxShadow: '0 4px #bbb' };
const compassCenter = { width: '70px', height: '70px', background: '#FFD700', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', border: '3px solid #b8860b' };

export default App;