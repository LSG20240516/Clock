import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StopWatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  font-size: 1.5rem;
  text-align: center;
`;

const TimeDisplay = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  color: #FFFFFF;
  background-color: #007bff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin: 0 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const StopWatchPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [milliseconds, setMilliseconds] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setMilliseconds(prevMilliseconds => {
          if (prevMilliseconds === 99) {
            setSeconds(prevSeconds => prevSeconds + 1);
            return 0;
          }
          return prevMilliseconds + 1;
        });
      }, 10); // 10ms마다 업데이트
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setMilliseconds(0);
    setSeconds(0);
  };

  const formatTime = (seconds, milliseconds) => {
    return `${seconds}.${milliseconds < 10 ? `0${milliseconds}` : milliseconds}`;
  };

  return (
    <StopWatchContainer>
      <TimeDisplay>{formatTime(seconds, milliseconds)}</TimeDisplay>
      <div>
        <Button onClick={start} disabled={isRunning}>시작</Button>
        <Button onClick={stop} disabled={!isRunning}>중지</Button>
        <Button onClick={reset}>초기화</Button>
      </div>
    </StopWatchContainer>
  );
};

export default StopWatchPage;
