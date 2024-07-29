import React, { useState } from 'react';
import Clock from './components/Clock';
import DClock from './components/DClock';
import StopWatchPage from './components/StopWatchPage';
import TimerPage from './components/TimerPage';
import WClock from './components/WClock'; // WClock 컴포넌트 임포트
import './test.css';

const App = () => {
  const [difficulty, setDifficulty] = useState('current'); // 기본 난이도는 현재 시간
  const [buttonText, setButtonText] = useState('현재시간');
  const [showComponent, setShowComponent] = useState('clock'); // 기본 컴포넌트는 Clock

  const handleDifficultyChange = (newDifficulty, text) => {
    setButtonText(text);
    if (newDifficulty !== difficulty) {
      setDifficulty('temp'); // 임시로 difficulty를 설정하여 강제로 리렌더링
      setTimeout(() => setDifficulty(newDifficulty), 0); // 원래 난이도로 복원
    }
  };

  const handleComponentChange = (component) => {
    setShowComponent(component);
    if (component !== 'clock') {
      setDifficulty('current'); // 스톱워치나 타이머에서는 난이도를 현재 시간으로 설정
      setButtonText('현재시간'); // 버튼 텍스트도 초기화
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
        <div id="header">
          {showComponent === 'clock' && (
            <>
              <button onClick={() => handleDifficultyChange('veryeasy', '매우 쉬움')}>매우 쉬움</button>
              <button onClick={() => handleDifficultyChange('easy', '쉬움')}>쉬움</button>
              <button onClick={() => handleDifficultyChange('medium', '보통')}>보통</button>
              <button onClick={() => handleDifficultyChange('hard', '어려움')}>어려움</button>
              <button onClick={() => handleDifficultyChange('veryhard', '매우 어려움')}>매우 어려움</button>
            </>
          )}
          <div className="nav-buttons">
            <button onClick={() => handleComponentChange('clock')}>시계문제</button>
            <button onClick={() => handleComponentChange('stopwatch')}>스톱워치</button>
            <button onClick={() => handleComponentChange('timer')}>타이머</button>
            <button onClick={() => handleComponentChange('wclock')}>세계시각</button>
          <button onClick={() => handleDifficultyChange('current', '현재시간')}>현재시간</button>
          </div>
        </div>
      </div>
      {showComponent === 'clock' && (
        <>
          <h1>{buttonText}</h1>
          <Clock difficulty={difficulty} />
          {difficulty === 'current' && <DClock />}
        </>
      )}
      {showComponent === 'stopwatch' && <StopWatchPage />}
      {showComponent === 'timer' && <TimerPage />}
      {showComponent === 'wclock' && <WClock initialTimeZone="Asia/Seoul" showDifficultyButtons={true} />} {/* WClock 컴포넌트 추가 */}
    </div>
  );
};

export default App;
