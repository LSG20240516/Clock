import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const TimerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    font-size: 1.5rem;
    text-align: center;
`;

const TimerDisplay = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  background-color: #007bff;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const InputsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
  }
`;

const Input = styled.input`
  font-size: 1rem;
  padding: 0.5rem;
  width: 60px;
  text-align: center;
`;

const Label = styled.span`
  font-size: 1rem;
  margin-right: 0.5rem;
`;

const TimerPage = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef(null);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => {
          if (prevTime.hours === 0 && prevTime.minutes === 0 && prevTime.seconds === 0) {
            setIsRunning(false);
            if (audioRef.current) {
              audioRef.current.play();
            }
            return prevTime;
          }

          const newSeconds = prevTime.seconds - 1;
          const newMinutes = newSeconds < 0 ? prevTime.minutes - 1 : prevTime.minutes;
          const newHours = newMinutes < 0 ? prevTime.hours - 1 : prevTime.hours;

          return {
            hours: newHours,
            minutes: newMinutes < 0 ? 59 : newMinutes,
            seconds: newSeconds < 0 ? 59 : newSeconds
          };
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const startTimer = () => {
    if (inputTime.hours > 0 || inputTime.minutes > 0 || inputTime.seconds > 0) {
      setTime(inputTime);
      setIsRunning(true);
    }
  };

  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setInputTime({ hours: 0, minutes: 0, seconds: 0 });
  };

  const handleInputChange = (e, field) => {
    const value = Math.max(0, parseInt(e.target.value, 10) || 0);
    setInputTime(prev => ({ ...prev, [field]: value }));
  };

  const formatTime = ({ hours, minutes, seconds }) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TimerWrapper>
      <TimerDisplay>{formatTime(time)}</TimerDisplay>
      <InputsWrapper>
        <InputWrapper>
          <Label>시</Label>
          <Input
            type="number"
            value={inputTime.hours}
            onChange={(e) => handleInputChange(e, 'hours')}
            placeholder="00"
            aria-label="Hours"
          />
        </InputWrapper>
        <InputWrapper>
          <Label>분</Label>
          <Input
            type="number"
            value={inputTime.minutes}
            onChange={(e) => handleInputChange(e, 'minutes')}
            placeholder="00"
            aria-label="Minutes"
          />
        </InputWrapper>
        <InputWrapper>
          <Label>초</Label>
          <Input
            type="number"
            value={inputTime.seconds}
            onChange={(e) => handleInputChange(e, 'seconds')}
            placeholder="00"
            aria-label="Seconds"
          />
        </InputWrapper>
      </InputsWrapper>
      <div>
        <Button onClick={startTimer}>시작</Button>
        <Button onClick={stopTimer}>정지</Button>
        <Button onClick={resetTimer}>리셋</Button>
      </div>
      <audio ref={audioRef} preload="auto">
        <source src="/path/to/your/alarm-sound.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </TimerWrapper>
  );
};

export default TimerPage;