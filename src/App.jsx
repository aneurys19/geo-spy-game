import React, { useState, useEffect } from 'react';

// --- MISSION DATA ---
const missions = {
  1: {
    title: "MISSION 1: COLOMBIA 🇨🇴",
    subtitle: "Ninja Infiltration. Recover 3 Encrypted Drives.",
    goalScore: 30,
    gridSize: 10,
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 2, 0, 0, 0, 0, 4, 1],
      [1, 0, 1, 0, 0, 2, 1, 1, 0, 1],
      [1, 4, 1, 0, 0, 0, 0, 0, 2, 1],
      [1, 0, 0, 0, 2, 0, 1, 0, 1, 1],
      [1, 2, 1, 0, 0, 0, 0, 4, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 2, 0, 1],
      [1, 0, 4, 2, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  }
};

const ASSETS = {
  SPRITES: '/assets/characters/level1_sprites.png',
  DASHBOARD: '/assets/ui/level1_dashboard.png',
};

export default function App() {
  const [gameState, setGameState] = useState('START');
  const [playerPosition, setPlayerPosition] = useState({ r: 1, c: 1 });
  const [grid, setGrid] = useState(missions[1].map);
  const [score, setScore] = useState(0);
  const [smokePos, setSmokePos] = useState(null); // Smoke bomb location

  const startMission = () => {
    setScore(0);
    setPlayerPosition({ r: 1, c: 1 });
    setGrid(missions[1].map.map(row => [...row]));
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
      
      // Wall/Obstacle detection
      if (grid[r][c] === 1 || grid[r][c] === 2) return prev;
      
      // Collection detection
      if (grid[r][c] === 4) {
        const newScore = score + 10;
        setScore(newScore);
        
        // TRIGGER SMOKE BOMB
        setSmokePos({ r, c });
        setTimeout(() => setSmokePos(null), 400);

        if (newScore >= missions[1].goalScore) setGameState('WON');
        
        const newGrid = [...grid];
        newGrid[r] = [...newGrid[r]];
        newGrid[r][c] = 0;
        setGrid(newGrid);
      }
      return { r, c };
    });
  };

  if (gameState !== 'PLAYING') {
    return (
      <div style={fullScreenCenter}>
        <div style={premiumCard}>
          <div style={tagLine}>SECURE LINE ENCRYPTED</div>
          <h1 style={titleStyle}>{gameState === 'WON' ? 'MISSION SUCCESS!' : 'COLOMBIA RECON'}</h1>
          <div style={infoBox}><p style={subtitleStyle}>{missions[1].subtitle}</p></div>
          <button onClick={startMission} style={goldBtn}>
            {gameState === 'START' ? 'INITIALIZE NINJA' : 'RETRY MISSION'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={gameLayout}>
      <div style={dashboardHeader}><div style={glassHUD}>⭐ {score}/30</div></div>
      <div style={gridWrapper}>
        <div style={gridContainer}>
          <div className="blueprint-overlay" />
          <div className="scanner-line" />
          <div style={gridStyle}>
            {grid.map((row, rIdx) => row.map((cell, cIdx) => (
              <div key={`${rIdx}-${cIdx}`} style={{
                ...tileStyle, 
                backgroundColor: cell === 1 ? '#1b5e20' : cell === 2 ? '#795548' : '#a5d6a7'
              }}>
                {cell === 1 && "🌳"}
                {cell === 4 && <span className="intel-drive">💾</span>}
                
                {/* RENDER SMOKE POOF */}
                {smokePos && smokePos.r === rIdx && smokePos.c === cIdx && (
                  <div className="smoke-effect" />
                )}

                {rIdx === playerPosition.r && cIdx === playerPosition.c && (
                   <div style={spriteAperture}>
                     <div style={{...spriteSheet, transform: 'translateX(0%)'}} />
                   </div>
                )}
              </div>
            )))}
          </div>
        </div>
      </div>

      <div style={dashboardFooter}>
        <div style={dPadGrid}>
          <div /> <button onPointerDown={() => movePlayer('up')} className="dir-btn" style={dirBtn}>▲</button> <div />
          <button onPointerDown={() => movePlayer('left')} className="dir-btn" style={dirBtn}>◀</button> 
          <div style={compassCenter}>🧭</div> 
          <button onPointerDown={() => movePlayer('right')} className="dir-btn" style={dirBtn}>▶</button>
          <div /> <button onPointerDown={() => movePlayer('down')} className="dir-btn" style={dirBtn}>▼</button> <div />
        </div>
      </div>

      <style>{`
        @keyframes scan { 0% { top: -5%; } 100% { top: 105%; } }
        .scanner-line { position: absolute; width: 100%; height: 4px; background: rgba(0, 255, 13, 0.4); box-shadow: 0 0 15px #00ff0d; z-index: 10; pointer-events: none; animation: scan 4s linear infinite; }
        .blueprint-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 5; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03)); background-size: 100% 3px, 3px 100%; opacity: 0.4; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .intel-drive { animation: float 2s ease-in-out infinite; display: inline-block; }
        
        /* NINJA SMOKE BOMB */
        @keyframes smokePoof {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.8; background: #fff; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .smoke-effect {
          position: absolute;
          width: 80%;
          height: 80%;
          background: #ddd;
          border-radius: 50%;
          animation: smokePoof 0.4s ease-out forwards;
          z-index: 6;
        }

        .dir-btn:active {
          transform: translateY(2px) scale(0.95);
          background: #e3f2fd !important; 
          color: #2196f3 !important;      
          box-shadow: 0 0 15px rgba(33, 150, 243, 0.6) !important; 
        }
      `}</style>
    </div>
  );
}

// --- STYLES ---
const fullScreenCenter = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d1117', fontFamily: 'sans-serif' };
const premiumCard = { background: '#fff', padding: '40px', borderRadius: '40px', textAlign: 'center', width: '85%', maxWidth: '380px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' };
const tagLine = { color: '#3949ab', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.7rem', marginBottom: '10px' };
const titleStyle = { margin: '0 0 15px 0', fontSize: '1.8rem', color: '#1a237e' };
const infoBox = { background: '#f0f2f5', padding: '15px', borderRadius: '20px', marginBottom: '25px' };
const subtitleStyle = { color: '#555', margin: 0, fontSize: '0.9rem' };
const goldBtn = { background: 'linear-gradient(180deg, #ffd54f 0%, #ff8f00 100%)', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 5px 0 #b36200' };
const gameLayout = { display: 'flex', flexDirection: 'column', height: '100dvh', background: '#0d1117', overflow: 'hidden', position: 'fixed', width: '100vw' };
const dashboardHeader = { height: '15vh', backgroundImage: `url(${ASSETS.DASHBOARD})`, backgroundSize: '100% 100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '10px' };
const gridWrapper = { flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' };
const gridContainer = { border: '4px solid #222', borderRadius: '12px', overflow: 'hidden', position: 'relative' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', width: 'min(92vw, 42vh)', aspectRatio: '1/1', background: '#333' };
const tileStyle = { position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', outline: '0.5px solid rgba(0,0,0,0.1)' };
const spriteAperture = { width: '100%', height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const spriteSheet = { position: 'absolute', width: '400%', height: '200%', backgroundImage: `url(${ASSETS.SPRITES})`, backgroundSize: '100% 100%', top: 0, left: 0, imageRendering: 'pixelated' };
const dashboardFooter = { height: '35vh', backgroundImage: `url(${ASSETS.DASHBOARD})`, backgroundSize: '100% 100%', backgroundPosition: '0% 48%', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const glassHUD = { background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', color: '#fff', fontWeight: 'bold' };
const dPadGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 65px)', gap: '8px' };
const dirBtn = { width: '65px', height: '65px', borderRadius: '15px', background: '#fff', fontSize: '24px', border: 'none', boxShadow: '0 4px #ccc', transition: 'all 0.1s ease', userSelect: 'none', WebkitTapHighlightColor: 'transparent' };
const compassCenter = { width: '65px', height: '65px', background: '#ffd54f', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '3px solid #ff8f00' };