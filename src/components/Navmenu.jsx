import { useState } from "react";
import '../styles/Clock.css';

const Navmenu = () => {
  const [difficulty, setDifficulty] = useState('current'); // 기본 난이도는 현재 시간
  const [showComponent, setShowComponent] = useState('clock'); // 기본 컴포넌트는 Clock
  const [buttonText, setButtonText] = useState('현재시간');

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
    <div className="navmenu">
      {showComponent === 'clock' && (
        <>
          <button onClick={() => handleDifficultyChange('veryeasy', '매우 쉬움')}>매우 쉬움</button>
          <button onClick={() => handleDifficultyChange('easy', '쉬움')}>쉬움</button>
          <button onClick={() => handleDifficultyChange('medium', '보통')}>보통</button>
          <button onClick={() => handleDifficultyChange('hard', '어려움')}>어려움</button>
          <button onClick={() => handleDifficultyChange('veryhard', '매우 어려움')}>매우 어려움</button>
        </>
      )}
    </div>
  )
}

export default Navmenu;