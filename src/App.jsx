import React, { useState } from 'react';

// --- MISSION DATA ---
const missions = {
  1: {
    id: 1,
    title: "MISSION 1: COLOMBIA 🇨🇴",
    subtitle: "Ninja Infiltration. Collect all 4 National Flags.",
    flag: 'https://flagcdn.com/w80/co.png',
    theme: 'jungle',
    facts: [
      "Colombia is the world's leading source of emeralds!",
      "It is the only country in South America with coastlines on both oceans.",
      "Colombia is the second most biodiverse country in the world!",
      "The Caño Cristales river is known as the River of Five Colors!"
    ],
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 2, 0, 0, 0, 0, 4, 1],
      [1, 0, 1, 0, 0, 2, 1, 1, 0, 1],
      [1, 4, 1, 0, 0, 0, 0, 0, 2, 1],
      [1, 0, 0, 0, 2, 0, 1, 0, 1, 1],
      [1, 2, 1, 0, 0, 0, 0, 4, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 2, 0, 1],
      [1, 4, 0, 2, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  },
  2: {
    id: 2,
    title: "MISSION 2: DOMINICAN REPUBLIC 🇩🇴",
    subtitle: "Coastal Stealth. Secure the 4 Caribbean Flags.",
    flag: 'https://flagcdn.com/w80/do.png',
    theme: 'beach',
    facts: [
      "The DR is the most visited destination in the Caribbean!",
      "It's the only flag in the world that features a Bible.",
      "Santo Domingo is the oldest European settlement in the Americas.",
      "Baseball is the most popular sport in the Dominican Republic!"
    ],
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 1, 1, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 2, 0, 2, 0, 0, 1],
      [1, 0, 1, 0, 0, 4, 0, 0, 1, 1],
      [1, 0, 1, 0, 2, 0, 2, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 4, 1, 1, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  },
  3: {
    id: 3,
    title: "MISSION 3: ICELAND 🇮🇸",
    subtitle: "Tundra Trek. Collect 4 Arctic Flags.",
    flag: 'https://flagcdn.com/w80/is.png',
    theme: 'arctic',
    facts: [
      "Iceland is known as the Land of Fire and Ice!",
      "It is home to one of the world's oldest parliaments, founded in 930 AD.",
      "Iceland has no mosquitoes at all!",
      "The Northern Lights are visible in Iceland for 8 months of the year."
    ],
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 4, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 4, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 2, 2, 0, 0, 4, 1],
      [1, 0, 1, 1, 2, 2, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 4, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
  }
};

const ASSETS = {
  SPRITES: '/assets/characters/level1_sprites.png',
  DASHBOARD: '/assets/ui/level1_dashboard.png',
  DECO: '/assets/background/colombia_deco.png' 
};

// Tree Leaf Component for Visual Polish
const AnimatedTree = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <span style={{ fontSize: '1.2rem', zIndex: 2 }}>🌳</span>
    <div className="leaf leaf-1">🍃</div>
    <div className="leaf leaf-2">🍃</div>
  </div>
);

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState('START');
  const [playerPosition, setPlayerPosition] = useState({ r: 1, c: 1 });
  const [grid, setGrid] = useState(missions[1].map);
  const [score, setScore] = useState(0);
  const [showFact, setShowFact] = useState(null);

  const speakFact = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2; utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const startMission = (levelId) => {
    const targetLevel = missions[levelId];
    setCurrentLevel(levelId);
    setScore(0);
    setPlayerPosition({ r: 1, c: 1 });
    setGrid(targetLevel.map.map(row => [...row]));
    setGameState('PLAYING');
    setShowFact(null);
  };

  const movePlayer = (direction) => {
    if (gameState !== 'PLAYING' || showFact) return;
    setPlayerPosition((prev) => {
      let { r, c } = prev;
      if (direction === 'up') r -= 1;
      if (direction === 'down') r += 1;
      if (direction === 'left') c -= 1;
      if (direction === 'right') c += 1;
      if (grid[r][c] === 1 || grid[r][c] === 2) return prev;
      if (grid[r][c] === 4) {
        const newScore = score + 10;
        setScore(newScore);
        const factText = missions[currentLevel].facts[(newScore / 10) - 1];
        setShowFact(factText);
        speakFact(factText);
        const newGrid = [...grid];
        newGrid[r] = [...newGrid[r]];
        newGrid[r][c] = 0;
        setGrid(newGrid);
        if (!newGrid.flat().includes(4)) {
            setTimeout(() => { speakFact("Mission Success!"); setGameState('WON'); }, 1000);
        }
      }
      return { r, c };
    });
  };

  if (gameState !== 'PLAYING') {
    const mission = missions[currentLevel];
    return (
      <div style={fullScreenCenter}>
        <div style={premiumCard}>
          <div style={tagLine}>SECURE LINE ENCRYPTED</div>
          <h1 style={titleStyle}>{gameState === 'WON' ? 'MISSION SUCCESS!' : mission.title}</h1>
          <div style={infoBox}><p style={subtitleStyle}>{mission.subtitle}</p></div>
          {gameState === 'WON' && currentLevel < 3 ? (
            <button onClick={() => startMission(currentLevel + 1)} style={goldBtn}>PROCEED TO NEXT MISSION</button>
          ) : (
            <button onClick={() => startMission(currentLevel)} style={goldBtn}>
              {gameState === 'START' ? 'INITIALIZE NINJA' : 'RETRY MISSION'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={gameLayout}>
      <div style={decoLayer}>
        <div style={{ ...decoPiece, top: '2%', left: '-20px', backgroundPosition: 'top left' }} />
        <div style={{ ...decoPiece, top: '35%', right: '-30px', backgroundPosition: 'bottom right' }} />
      </div>

      <div style={dashboardHeader}><div style={glassHUD}>⭐ {score}</div></div>
      <div style={gridWrapper}>
        <div style={gridContainer}>
          {showFact && (
            <div style={factOverlay}>
              <div style={factCard}>
                <div style={factTitle}>INTEL RECEIVED</div>
                <p style={factText}>{showFact}</p>
                <button style={factCloseBtn} onClick={() => setShowFact(null)}>CONTINUE</button>
              </div>
            </div>
          )}
          <div className="blueprint-overlay" /><div className="scanner-line" />
          <div style={gridStyle}>
            {grid.map((row, rIdx) => row.map((cell, cIdx) => (
              <div key={`${rIdx}-${cIdx}`} style={{
                ...tileStyle, 
                backgroundColor: cell === 1 ? (currentLevel === 3 ? '#b3e5fc' : '#1b5e20') : cell === 2 ? '#795548' : (currentLevel === 3 ? '#e1f5fe' : '#a5d6a7')
              }}>
                {cell === 1 && (currentLevel === 3 ? "🏔️" : <AnimatedTree />)}
                {cell === 2 && "🪨"}
                {cell === 4 && <img src={missions[currentLevel].flag} alt="flag" className="intel-flag" />}
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
        .intel-flag { animation: float 2s ease-in-out infinite; width: 70%; height: auto; border-radius: 2px; }
        @keyframes leafDrift { 
          0% { transform: translate(0,0) rotate(0deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translate(10px, 10px) rotate(90deg); opacity: 0; }
        }
        .leaf { position: absolute; font-size: 0.6rem; pointer-events: none; z-index: 1; animation: leafDrift 3s infinite linear; }
        .leaf-1 { top: 0; left: 5px; animation-delay: 0s; }
        .leaf-2 { bottom: 5px; right: 0; animation-delay: 1.5s; }
        .dir-btn:active { transform: translateY(2px) scale(0.95); background: #e3f2fd !important; }
      `}</style>
    </div>
  );
}

// --- STYLES ---
const decoLayer = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' };
const decoPiece = { position: 'absolute', width: '150px', height: '150px', backgroundImage: `url(${ASSETS.DECO})`, backgroundSize: '250%', opacity: 0.8, zIndex: 0 };
const factOverlay = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const factCard = { background: '#fff', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 0 20px #ffd54f', border: '2px solid #ff8f00', maxWidth: '80%' };
const factTitle = { color: '#ff8f00', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '10px' };
const factText = { color: '#333', fontSize: '1rem', lineHeight: '1.4' };
const factCloseBtn = { marginTop: '15px', padding: '10px 25px', background: '#333', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' };
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
const tileStyle = { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', outline: '0.5px solid rgba(0,0,0,0.1)' };
const spriteAperture = { width: '100%', height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const spriteSheet = { position: 'absolute', width: '400%', height: '200%', backgroundImage: `url(${ASSETS.SPRITES})`, backgroundSize: '100% 100%', top: 0, left: 0, imageRendering: 'pixelated' };
const dashboardFooter = { height: '35vh', backgroundImage: `url(${ASSETS.DASHBOARD})`, backgroundSize: '100% 100%', backgroundPosition: '0% 48%', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const glassHUD = { background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', color: '#fff', fontWeight: 'bold' };
const dPadGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 65px)', gap: '8px' };
const dirBtn = { width: '65px', height: '65px', borderRadius: '15px', background: '#fff', fontSize: '24px', border: 'none', boxShadow: '0 4px #ccc', transition: 'all 0.1s ease', userSelect: 'none', WebkitTapHighlightColor: 'transparent' };
const compassCenter = { width: '65px', height: '65px', background: '#ffd54f', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '3px solid #ff8f00' };