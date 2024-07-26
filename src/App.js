import React, { useState } from 'react';
import Clock from './components/Clock';
import DClock from './components/DClock';
import './test.css';

const App = () => {
  const [difficulty, setDifficulty] = useState('current');

  const handleDifficultyChange = (newDifficulty) => {
    if (newDifficulty === 'current') {
      setDifficulty(newDifficulty); // 현재 시간으로 직접 설정
    } else {
      setDifficulty('temp'); // difficulty를 임시 값으로 변경하여 강제로 리렌더링
      setTimeout(() => {
        setDifficulty(newDifficulty); // 원래 difficulty 값으로 복원
      }, 0); // 0ms 지연 후 원래 값으로 설정
    }
  };

  return (
    <div>
      <div className="controls">

        <input type="checkbox" id="icon" />
        <label htmlFor="icon">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <div id='header'>
          <button onClick={() => handleDifficultyChange('current')}>현재시간</button>
          <button onClick={() => handleDifficultyChange('easy')}>쉬움</button>
          <button onClick={() => handleDifficultyChange('medium')}>보통</button>
          <button onClick={() => handleDifficultyChange('hard')}>어려움</button>
          <button onClick={() => handleDifficultyChange('veryhard')}>매우 어려움</button>
        </div>
      </div>
      <Clock difficulty={difficulty} />
      {difficulty === 'current' && <DClock />}
    </div>
  );
};

export default App;
