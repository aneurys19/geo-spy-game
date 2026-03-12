import React, { useState } from 'react';

// --- MISSION & CHALLENGE DATA ---
const NINJA_RANKS = ["WHITE BELT", "YELLOW BELT", "GREEN BELT", "BLUE BELT", "RED BELT", "BLACK BELT"];
const MOVE_TARGETS = { 1: 40, 2: 35, 3: 45, 4: 50, 5: 55 };

const missions = {
  1: { id: 1, title: "MISSION 1: COLOMBIA 🇨🇴", flag: 'https://flagcdn.com/w80/co.png', deco: '/assets/background/colombia_deco.png', bg: '#0a2e0a', accent: '#1b5e20', particle: '#a5d6a7', facts: ["Colombia is the world's leading source of emeralds!", "It is the only country in South America with coastlines on both oceans.", "Colombia is the second most biodiverse country in the world!", "Caño Cristales is known as the River of Five Colors!"], map: [[1,1,1,1,1,1,1,1,1,1],[1,0,0,2,0,0,0,0,4,1],[1,0,1,0,0,2,1,1,0,1],[1,4,1,0,0,0,0,0,2,1],[1,0,0,0,2,0,1,0,1,1],[1,2,1,0,0,0,0,4,0,1],[1,0,0,0,1,1,0,2,0,1],[1,4,0,2,0,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]] },
  2: { id: 2, title: "MISSION 2: DOMINICAN REPUBLIC 🇩🇴", flag: 'https://flagcdn.com/w80/do.png', deco: '/assets/background/dr_deco.png', bg: '#004d40', accent: '#00796b', particle: '#80cbc4', facts: ["The DR is the most visited destination in the Caribbean!", "It's the only flag in the world that features a Bible.", "Santo Domingo is the oldest European settlement in the Americas.", "Baseball is the most popular sport in the Dominican Republic!"], map: [[1,1,1,1,1,1,1,1,1,1],[1,4,0,0,0,0,0,0,4,1],[1,1,1,0,0,1,0,1,0,1],[1,0,0,0,2,0,2,0,0,1],[1,0,1,0,0,4,0,0,1,1],[1,0,1,0,2,0,2,0,1,1],[1,0,0,0,0,0,0,0,0,1],[1,4,1,1,1,0,1,1,1,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]] },
  3: { id: 3, title: "MISSION 3: ICELAND 🇮🇸", flag: 'https://flagcdn.com/w80/is.png', deco: '/assets/background/iceland_deco.png', bg: '#012a4a', accent: '#013a63', particle: '#ffffff', facts: ["Iceland is known as the Land of Fire and Ice!", "It is home to one of the world's oldest parliaments.", "Iceland has no mosquitoes at all!", "The Northern Lights are visible in Iceland for 8 months of the year."], map: [[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,4,0,0,0,1],[1,0,1,1,0,1,1,1,0,1],[1,4,1,0,0,0,0,1,0,1],[1,0,0,0,2,2,0,0,4,1],[1,0,1,1,2,2,1,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,4,0,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]] },
  4: { id: 4, title: "MISSION 4: JAPAN 🇯🇵", flag: 'https://flagcdn.com/w80/jp.png', deco: '/assets/background/japan_deco.png', bg: '#2d0a1a', accent: '#4a1127', particle: '#ffcdd2', facts: ["Japan has over 5 million vending machines!", "The Shinkansen bullet trains are among the fastest in the world.", "Japan consists of over 6,800 islands.", "Mount Fuji is actually an active volcano!"], map: [[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,4,1,4,0,0,1],[1,0,1,1,0,1,0,1,0,1],[1,0,1,0,0,0,0,1,0,1],[1,4,0,0,2,2,0,0,4,1],[1,1,1,0,2,2,0,1,1,1],[1,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]] },
  5: { id: 5, title: "MISSION 5: EGYPT 🇪🇬", flag: 'https://flagcdn.com/w80/eg.png', deco: '/assets/background/egypt_deco.png', bg: '#5d4037', accent: '#8d6e63', particle: '#ffd54f', facts: ["The Great Pyramid of Giza was the tallest man-made structure for 3,800 years!", "Ancient Egyptians invented the 365-day calendar.", "The Nile River is the longest river in the world.", "Egyptians used hieroglyphics as a form of writing!"], map: [[1,1,1,1,1,1,1,1,1,1],[1,4,0,0,0,1,0,0,4,1],[1,0,1,1,0,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,1,4,2,2,4,1,0,1],[1,0,1,0,2,2,0,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,0,0,0,0,1,1,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]] }
};

const ASSETS = { SPRITES: '/assets/characters/level1_sprites.png' };

const GlobalOverlay = ({ color }) => (
  <div className="global-overlay">
    {[...Array(40)].map((_, i) => (
      <div key={i} className="dot" style={{ backgroundColor: color, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 5}s` }} />
    ))}
  </div>
);

const AnimatedTree = () => (<div className="tile-content"><span style={{fontSize:'1.2rem',zIndex:2}}>🌳</span><div className="leaf leaf-1">🍃</div><div className="leaf leaf-2">🍃</div></div>);
const CherryBlossom = () => (<div className="tile-content"><span style={{fontSize:'1.2rem',zIndex:2}}>🌸</span><div className="petal petal-1">🌸</div><div className="petal petal-2">🌸</div></div>);

export default function App() {
  const [gameState, setGameState] = useState('START');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [playerPosition, setPlayerPosition] = useState({ r: 1, c: 1 });
  const [grid, setGrid] = useState(missions[1].map);
  const [score, setScore] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [showFact, setShowFact] = useState(null);

  const speakFact = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2; utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  const startMission = (levelId) => {
    const targetLevel = missions[levelId];
    setCurrentLevel(levelId); setScore(0); setMoveCount(0); setPlayerPosition({ r: 1, c: 1 });
    setGrid(targetLevel.map.map(row => [...row]));
    setGameState('PLAYING'); setShowFact(null);
  };

  const movePlayer = (direction) => {
    if (gameState !== 'PLAYING' || showFact) return;
    setPlayerPosition((prev) => {
      let { r, c } = prev;
      if (direction === 'up') r -= 1; if (direction === 'down') r += 1;
      if (direction === 'left') c -= 1; if (direction === 'right') c += 1;
      if (grid[r][c] === 1 || grid[r][c] === 2) return prev;
      
      setMoveCount(m => m + 1);

      if (grid[r][c] === 4) {
        const newScore = score + 10; setScore(newScore);
        const factText = missions[currentLevel].facts[(newScore / 10) - 1];
        setShowFact(factText); speakFact(factText);
        const newGrid = [...grid]; newGrid[r] = [...newGrid[r]]; newGrid[r][c] = 0;
        setGrid(newGrid);
        if (!newGrid.flat().includes(4)) setTimeout(() => { speakFact("Mission Success!"); setGameState('WON'); }, 800);
      }
      return { r, c };
    });
  };

  const currentMission = missions[currentLevel];

  if (gameState === 'START' || gameState === 'WON') {
    const isElite = moveCount > 0 && moveCount <= MOVE_TARGETS[currentLevel];
    return (
      <div style={fullScreenCenter}>
        <div style={premiumCard}>
          <h1 style={{color: '#1a237e', marginBottom: '10px'}}>{gameState === 'WON' ? 'SUCCESS!' : 'GEOSPY NINJA'}</h1>
          
          {gameState === 'WON' && (
            <div style={{ background: '#f0f4f8', padding: '15px', borderRadius: '20px', border: '2px dashed #1a237e', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#1a237e', fontWeight: 'bold' }}>NINJA EVALUATION</div>
              <div style={{ fontSize: '1.2rem', margin: '10px 0' }}>RANK: {NINJA_RANKS[currentLevel]}</div>
              <div style={{ fontSize: '0.9rem', color: isElite ? '#2e7d32' : '#1a237e' }}>
                {isElite ? '🏆 ELITE STATUS ACHIEVED!' : `MOVES: ${moveCount} (Target: ${MOVE_TARGETS[currentLevel]})`}
              </div>
            </div>
          )}

          <p style={{color: '#666', marginBottom: '20px', fontSize: '0.9rem'}}>SELECT YOUR MISSION LOCATION</p>
          <div style={missionSelectorGrid}>
            {Object.values(missions).map(m => {
              const countryName = m.title.split(': ')[1].split(' ')[0];
              return (
                <button key={m.id} onClick={() => startMission(m.id)} style={missionCard}>
                  <div style={{fontSize: '1.4rem'}}>{m.title.split(' ').pop()}</div>
                  <div style={{fontWeight: 'bold', fontSize: '0.75rem', color: '#1a237e', margin: '4px 0'}}>{countryName}</div>
                  <div style={{fontSize: '0.6rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px'}}>DEPLOY</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{...gameLayout, backgroundColor: currentMission.bg}}>
      <GlobalOverlay color={currentMission.particle} />
      
      <div style={decoContainer}>
        <div style={{...decoPiece, top:'5%', left:'-20px', backgroundImage:`url(${currentMission.deco})` }} />
        <div style={{...decoPiece, bottom:'30%', right:'-30px', backgroundImage:`url(${currentMission.deco})` }} />
      </div>

      <div style={headerStyle}>
        <div style={glassPill}>⭐ {score}</div>
        <div style={{...glassPill, marginLeft: '10px', fontSize: '0.8rem'}}>👟 {moveCount}</div>
      </div>
      
      <div style={gridWrapper}>
        <div style={gridContainer}>
          {showFact && (
            <div style={factOverlay}>
              <div style={factCard}>
                <p style={factText}>{showFact}</p>
                <button style={closeBtn} onClick={() => setShowFact(null)}>CONTINUE</button>
              </div>
            </div>
          )}
          <div style={gridInner}>
            {grid.map((row, rIdx) => row.map((cell, cIdx) => (
              <div key={`${rIdx}-${cIdx}`} style={{...tileBase, backgroundColor: cell === 1 ? currentMission.accent : 'rgba(255,255,255,0.05)'}}>
                {cell === 1 && (currentLevel === 3 ? "🏔️" : currentLevel === 4 ? <CherryBlossom /> : currentLevel === 5 ? "▲" : <AnimatedTree />)}
                {cell === 2 && (currentLevel === 4 ? "⛩️" : currentLevel === 5 ? "🏺" : "🪨")}
                {cell === 4 && <img src={currentMission.flag} style={{width:'70%', borderRadius:'2px'}} alt="flag" />}
                {rIdx === playerPosition.r && cIdx === playerPosition.c && (
                   <div style={spriteAperture}><div style={{...spriteSheet, backgroundImage:`url(${ASSETS.SPRITES})`}} /></div>
                )}
              </div>
            )))}
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <div style={dPadContainer}>
          <div /> <button onPointerDown={() => movePlayer('up')} style={dirBtn}>▲</button> <div />
          <button onPointerDown={() => movePlayer('left')} style={dirBtn}>◀</button> <div style={compass}>🧭</div> <button onPointerDown={() => movePlayer('right')} style={dirBtn}>▶</button>
          <div /> <button onPointerDown={() => movePlayer('down')} style={dirBtn}>▼</button> <div />
        </div>
      </div>

      <style>{`
        @keyframes drift { 0% { transform: translate(0,0) rotate(0deg); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translate(10px,10px) rotate(90deg); opacity: 0; } }
        .leaf, .petal { position: absolute; font-size: 0.6rem; animation: drift 3s infinite linear; pointer-events: none; }
        .tile-content { position: relative; width: 100%; height: 100%; display: flex; justifyContent: center; alignItems: center; }
        .leaf-1, .petal-1 { top: 0; left: 5px; } .leaf-2, .petal-2 { bottom: 5px; right: 0; animation-delay: 1.5s; }
        .global-overlay { position: absolute; width: 100%; height: 100%; top:0; left:0; pointer-events: none; z-index: 20; overflow: hidden; }
        .dot { position: absolute; width: 3px; height: 3px; border-radius: 50%; opacity: 0; animation: fall linear infinite; }
        @keyframes fall { 0% { transform: translate(0,-10vh); opacity:0; } 10% { opacity:0.6; } 100% { transform: translate(20vw, 110vh); opacity:0; } }
      `}</style>
    </div>
  );
}

const fullScreenCenter = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d1117' };
const premiumCard = { background: '#fff', padding: '30px', borderRadius: '40px', textAlign: 'center', width: '92%', maxWidth: '420px' };
const missionSelectorGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' };
const missionCard = { background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '15px', padding: '12px 5px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const gameLayout = { display: 'flex', flexDirection: 'column', height: '100dvh', width: '100vw', overflow: 'hidden', position: 'fixed' };
const decoContainer = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 };
const decoPiece = { position: 'absolute', width: '180px', height: '180px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', opacity: 0.5 };
const headerStyle = { height: '12vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '10px', zIndex: 10 };
const glassPill = { background: 'rgba(0,0,0,0.5)', padding: '10px 25px', borderRadius: '25px', color: '#fff', fontWeight: 'bold' };
const gridWrapper = { flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5 };
const gridContainer = { border: '2px solid rgba(255,255,255,0.2)', borderRadius: '15px', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(5px)' };
const gridInner = { display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', width: 'min(92vw, 48vh)', aspectRatio: '1/1' };
const tileBase = { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const spriteAperture = { width: '100%', height: '100%', overflow: 'hidden', position: 'relative' };
const spriteSheet = { position: 'absolute', width: '400%', height: '200%', backgroundSize: '100% 100%', imageRendering: 'pixelated' };
const footerStyle = { height: '35vh', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 };
const dPadContainer = { display: 'grid', gridTemplateColumns: 'repeat(3, 65px)', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '35px' };
const dirBtn = { width: '65px', height: '65px', borderRadius: '18px', border: 'none', background: '#fff', fontSize: '24px' };
const compass = { display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px' };
const factOverlay = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' };
const factCard = { background: '#fff', padding: '30px', borderRadius: '30px', textAlign: 'center' };
const factText = { color: '#333', fontSize: '1.1rem', marginBottom: '20px' };
const closeBtn = { padding: '12px 30px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', width: '100%' };