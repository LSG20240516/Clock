import React, { useState } from 'react';
import Clock from './components/Clock';
import DClock from './components/DClock';

const App = () => {
  const [difficulty, setDifficulty] = useState('current');

  return (
    <div>
      <div className="controls">
        <button onClick={() => setDifficulty('current')}>현재시간</button>
        <button onClick={() => setDifficulty('easy')}>쉬움</button>
        <button onClick={() => setDifficulty('medium')}>보통</button>
        <button onClick={() => setDifficulty('hard')}>어려움</button>
        <button onClick={() => setDifficulty('veryhard')}>매우 어려움</button>
      </div>
      <h1 />
      <Clock difficulty={difficulty} />
      {difficulty === 'current' && <DClock />}
    </div>
  );
};

export default App;
