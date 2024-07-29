import React, { useState } from 'react';
import Clock from './components/Clock';
import DClock from './components/DClock';
import StopWatchPage from './components/StopWatchPage';
import TimerPage from './components/TimerPage';
import WClock from './components/WClock';
import './test.css';

const App = () => {
  const [difficulty, setDifficulty] = useState('current');
  const [buttonText, setButtonText] = useState('현재시간');
  const [showComponent, setShowComponent] = useState('clock');
  const [showClockButtons, setShowClockButtons] = useState(false);

  const handleDifficultyChange = (newDifficulty, text) => {
    setButtonText(text);
    if (newDifficulty !== difficulty) {
      setDifficulty('temp');
      setTimeout(() => setDifficulty(newDifficulty), 0);
    }
  };

  const handleComponentChange = (component) => {
    setShowComponent(component);
    if (component !== 'clock') {
      setDifficulty('current');
      setButtonText('현재시간');
      setShowClockButtons(false); // 다른 컴포넌트로 변경 시 시계 문제 하위 버튼 숨기기
    }
  };

  const toggleClockButtons = () => {
    setShowClockButtons(prevState => !prevState);
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
          <div className="nav-buttons">
            <button onClick={() => {
              // 클릭 시 시계문제 하위 버튼 보이기/숨기기
              handleComponentChange('clock');
              toggleClockButtons();
            }}>
              {showClockButtons ? '시계문제 숨기기' : '시계문제 보이기'}
            </button>
            <button onClick={() => handleComponentChange('stopwatch')}>스톱워치</button>
            <button onClick={() => handleComponentChange('timer')}>타이머</button>
            <button onClick={() => handleComponentChange('wclock')}>세계시각</button>
            <button onClick={() => handleComponentChange('current')}>현재시간</button>
          </div>
          {showComponent === 'clock' && showClockButtons && (
            <>
              <button onClick={() => handleDifficultyChange('veryeasy', '매우 쉬움')}>매우 쉬움</button>
              <button onClick={() => handleDifficultyChange('easy', '쉬움')}>쉬움</button>
              <button onClick={() => handleDifficultyChange('medium', '보통')}>보통</button>
              <button onClick={() => handleDifficultyChange('hard', '어려움')}>어려움</button>
              <button onClick={() => handleDifficultyChange('veryhard', '매우 어려움')}>매우 어려움</button>
            </>
          )}
        </div>
      </div>
      {showComponent === 'clock' && (
        <>
          <h1>{buttonText}</h1>
          <Clock difficulty={difficulty} />
          {difficulty === 'current' && <DClock />}
        </>
      )}
      {showComponent === 'current' && (
        <>
          <h1>{buttonText}</h1>
          <Clock difficulty={difficulty} />
          {difficulty === 'current' && <DClock />}
        </>
      )}
      {showComponent === 'stopwatch' && <StopWatchPage />}
      {showComponent === 'timer' && <TimerPage />}
      {showComponent === 'wclock' && <WClock initialTimeZone="Asia/Seoul" showDifficultyButtons={true} />}
    </div>
  );
};

export default App;
