import React, { useState, useEffect } from 'react';
import { missions, NINJA_RANKS, MOVE_TARGETS } from './MissionData';

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
  const [unlockedMissions, setUnlockedMissions] = useState([1]);

  useEffect(() => {
    const saved = localStorage.getItem('geospy_ninja_progress');
    if (saved) setUnlockedMissions(JSON.parse(saved));
  }, []);

  const speakFact = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2; utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  const startMission = (levelId) => {
    const targetLevel = missions[levelId];
    if (targetLevel.type === 'PREMIUM') {
      const watchAd = window.confirm("NINJA RECON: Watch a quick video (Ad) to unlock this Elite Mission?");
      if (!watchAd) return;
    }
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
      
      if (grid[r] && grid[r][c] !== undefined && grid[r][c] !== 1 && grid[r][c] !== 2) {
        setMoveCount(m => m + 1);

        if (grid[r][c] === 4) {
          // --- FLAG CAPTURED LOGIC ---
          const newScore = score + 10; 
          setScore(newScore);
          
          const factText = missions[currentLevel].facts[(newScore / 10) - 1];
          setShowFact(factText); 
          speakFact(factText);
          
          const newGrid = [...grid]; 
          newGrid[r] = [...newGrid[r]]; 
          newGrid[r][c] = 0; // Remove flag from grid immediately
          setGrid(newGrid);
          
          const flagsRemaining = newGrid.flat().filter(cell => cell === 4).length;

          if (flagsRemaining === 0) {
            // --- VICTORY DELAY ADDED HERE ---
            setTimeout(() => { 
              if (gameState !== 'WON') { 
                speakFact("Mission Success!"); 
                setGameState('WON');
                const nextLevel = currentLevel + 1;
                const newProgress = [...new Set([...unlockedMissions, nextLevel])];
                setUnlockedMissions(newProgress);
                localStorage.setItem('geospy_ninja_progress', JSON.stringify(newProgress));
              }
            }, 2500); // 2.5 second buffer
          }
        }
        return { r, c };
      }
      return prev;
    });
  };

  const currentMission = missions[currentLevel];

  if (gameState === 'START' || gameState === 'WON') {
    const moveTarget = MOVE_TARGETS[currentLevel] || 100;
    const isElite = moveCount > 0 && moveCount <= moveTarget;
    const currentRank = NINJA_RANKS[currentLevel - 1] || "ELITE OPERATIVE";

    return (
      <div style={fullScreenCenter}>
        <div style={premiumCard}>
          <h1 style={{color: '#1a237e', marginBottom: '10px'}}>{gameState === 'WON' ? 'SUCCESS!' : 'GEOSPY NINJA'}</h1>
          
          {gameState === 'WON' && (
            <div style={evaluationBox}>
              <div style={{ fontSize: '0.8rem', color: '#1a237e', fontWeight: 'bold' }}>NINJA EVALUATION</div>
              <div style={{ fontSize: '1.2rem', margin: '10px 0' }}>RANK: {currentRank}</div>
              <div style={{ fontSize: '0.9rem', color: isElite ? '#2e7d32' : '#1a237e' }}>
                {isElite ? '🏆 ELITE STATUS ACHIEVED!' : `MOVES: ${moveCount} (Target: ${moveTarget})`}
              </div>
            </div>
          )}

          <p style={{color: '#666', marginBottom: '20px', fontSize: '0.9rem'}}>SELECT YOUR MISSION LOCATION</p>
          <div style={missionSelectorGrid}>
            {Object.values(missions).map(m => {
              const isUnlocked = unlockedMissions.includes(m.id);
              const parts = m.title.split(': ');
              const countryName = parts[1] ? parts[1].split(' ')[0] : "Target";
              
              return (
                <button 
                  key={m.id} 
                  onClick={() => isUnlocked ? startMission(m.id) : alert("Unlock previous levels first!")} 
                  style={{...missionCard, opacity: isUnlocked ? 1 : 0.6}}
                >
                  <div style={{fontSize: '1.4rem'}}>{m.title.split(' ').pop()}</div>
                  <div style={{fontWeight: 'bold', fontSize: '0.75rem', color: '#1a237e'}}>{countryName}</div>
                  {!isUnlocked ? <div style={{fontSize:'0.6rem', color:'#888'}}>🔒 LOCKED</div> : m.type === 'PREMIUM' && <div style={{fontSize:'0.6rem', color:'#d32f2f', fontWeight:'bold'}}>📺 AD</div>}
                </button>
              );
            })}
          </div>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} style={resetLink}>Reset All Progress</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{...gameLayout, backgroundColor: currentMission.bg}}>
      <GlobalOverlay color={currentMission.particle} />
      
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
          <div style={{...gridInner, gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`}}>
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
        .tile-content { position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
        .leaf-1, .petal-1 { top: 0; left: 5px; } .leaf-2, .petal-2 { bottom: 5px; right: 0; animation-delay: 1.5s; }
        .global-overlay { position: absolute; width: 100%; height: 100%; top:0; left:0; pointer-events: none; z-index: 20; overflow: hidden; }
        .dot { position: absolute; width: 3px; height: 3px; border-radius: 50%; opacity: 0; animation: fall linear infinite; }
        @keyframes fall { 0% { transform: translate(0,-10vh); opacity:0; } 10% { opacity:0.6; } 100% { transform: translate(20vw, 110vh); opacity:0; } }
      `}</style>
    </div>
  );
}

// --- STYLES ---
const fullScreenCenter = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d1117' };
const premiumCard = { background: '#fff', padding: '30px', borderRadius: '40px', textAlign: 'center', width: '92%', maxWidth: '420px' };
const evaluationBox = { background: '#f0f4f8', padding: '15px', borderRadius: '20px', border: '2px dashed #1a237e', marginBottom: '20px' };
const missionSelectorGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' };
const missionCard = { background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '15px', padding: '12px 5px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const resetLink = { marginTop: '15px', background: 'none', border: 'none', color: '#888', fontSize: '0.7rem', textDecoration: 'underline', cursor: 'pointer' };
const gameLayout = { display: 'flex', flexDirection: 'column', height: '100dvh', width: '100vw', overflow: 'hidden', position: 'fixed' };
const headerStyle = { height: '12vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '10px', zIndex: 10 };
const glassPill = { background: 'rgba(0,0,0,0.5)', padding: '10px 25px', borderRadius: '25px', color: '#fff', fontWeight: 'bold' };
const gridWrapper = { flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5 };
const gridContainer = { border: '2px solid rgba(255,255,255,0.2)', borderRadius: '15px', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(5px)' };
const gridInner = { display: 'grid', width: 'min(92vw, 48vh)', aspectRatio: '1/1' };
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