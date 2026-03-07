import { useState, useEffect } from 'react';

const startingMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 3, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 4, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 4, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function App() {
  const [playerPosition, setPlayerPosition] = useState({ r: 1, c: 1 });
  const [grid, setGrid] = useState(startingMap);
  const [score, setScore] = useState(0);
  const hasWon = score === 40;

  useEffect(() => {
    if (hasWon) return;
    const handleKeyDown = (e) => {
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) e.preventDefault();
      setPlayerPosition((prev) => {
        let { r: newR, c: newC } = prev;
        if (e.key === 'ArrowUp') newR -= 1;
        if (e.key === 'ArrowDown') newR += 1;
        if (e.key === 'ArrowLeft') newC -= 1;
        if (e.key === 'ArrowRight') newC += 1;
        if (grid[newR][newC] === 1) return prev; 
        if (grid[newR][newC] === 3 || grid[newR][newC] === 4) {
          setScore((s) => s + 10); 
          const newGrid = [...grid];
          newGrid[newR] = [...newGrid[newR]];
          newGrid[newR][newC] = 0; 
          setGrid(newGrid);
        }
        return { r: newR, c: newC }; 
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, hasWon]);

  const restartGame = () => {
    setScore(0);
    setPlayerPosition({ r: 1, c: 1 });
    setGrid(startingMap);
  };

  if (hasWon) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '20px', textAlign: 'center' }}>
          <h1>Mission Accomplished! 🎉</h1>
          <button onClick={restartGame} style={{ padding: '15px 40px', fontSize: '1.2rem', cursor: 'pointer', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '50px' }}>Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', fontFamily: 'sans-serif', paddingTop: '40px' }}>
      <div style={{ backgroundColor: 'white', padding: '10px 40px', borderRadius: '50px', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>Geography Quest! Score: {score}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 45px)', gap: '4px', backgroundColor: '#8b4513', padding: '12px', borderRadius: '15px' }}>
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            let content = '';
            let style = { width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px', borderRadius: '8px', backgroundColor: cell === 1 ? '#81c784' : '#e8d3a7' };
            if (cell === 1) content = '🌴';
            if (cell === 3) content = '🇨🇴';
            if (cell === 4) content = '🇩🇴';
            if (rowIndex === playerPosition.r && colIndex === playerPosition.c) content = '🐈';
            return <div key={`${rowIndex}-${colIndex}`} style={style} className={cell !== 1 ? 'bounce' : ''}>{content}</div>;
          })
        ))}
      </div>
      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } } .bounce { animation: bounce 0.8s infinite ease-in-out; }`}</style>
    </div>
  );
}
export default App;