import React, { useEffect, useState } from 'react';
import '../styles/Clock.css';

const Clock = ({ difficulty }) => {
  const [time, setTime] = useState(new Date());
  const [isRunning, setIsRunning] = useState(difficulty === 'current');
  const [inputHour, setInputHour] = useState('');
  const [inputMinute, setInputMinute] = useState('');
  const [inputSecond, setInputSecond] = useState('');
  const [input24Hour, setInput24Hour] = useState('');
  const [message, setMessage] = useState('');
  const [isAM, setIsAM] = useState(true);
  const [color, setColor] = useState('');

  useEffect(() => {
    if (difficulty === 'current') {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      const randomTime = new Date();
      randomTime.setHours(Math.floor(Math.random() * 24));
      randomTime.setMinutes(Math.floor(Math.random() * 60));
      randomTime.setSeconds(Math.floor(Math.random() * 60));
      setTime(randomTime);
      if (difficulty === 'veryhard') {
        setIsAM(randomTime.getHours() < 12);
      }
    }
  }, [difficulty]);


  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isRunning]);

  // Clear input fields when difficulty changes
  useEffect(() => {
    setInputHour('');
    setInputMinute('');
    setInputSecond('');
    setInput24Hour('');
    setMessage('');
  }, [difficulty]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };
  const checkAnswer = () => {
    // 현재 시간 (24시간제)
    const currentHour24 = time.getHours();
    const currentMinute = time.getMinutes();
    const currentSecond = time.getSeconds();

    // 현재 시간 (12시간제)
    const currentHour12 = (currentHour24 % 12) || 12; // 0시는 12시로 표시

    // 입력값 변환
    const inputHourNum = isNaN(parseInt(inputHour, 10)) ? -1 : parseInt(inputHour, 10);
    const inputMinuteNum = isNaN(parseInt(inputMinute, 10)) ? -1 : parseInt(inputMinute, 10);
    const inputSecondNum = isNaN(parseInt(inputSecond, 10)) ? -1 : parseInt(inputSecond, 10);
    const input24HourNum = isNaN(parseInt(input24Hour, 10)) ? -1 : parseInt(input24Hour, 10);

    // 24시간제 시간 체크
    let adjusted24Hour = input24HourNum;
    if (isAM && adjusted24Hour === 12) {
      adjusted24Hour = 0; // 오전 12시는 0시로
    } else if (!isAM && adjusted24Hour < 12) {
      adjusted24Hour += 12; // 오후 시간으로 조정
    }
    const is24HourCorrect = adjusted24Hour === currentHour24;

    // 12시간제 시간 체크
    const isCorrectHour12 = inputHourNum === currentHour12;

    // 최종 정답 체크
    let isCorrect = false;

    if (difficulty === 'veryeasy') {
      isCorrect = isCorrectHour12;
    } else if (difficulty === 'easy') {
      isCorrect = isCorrectHour12 && inputMinuteNum === currentMinute;
    } else if (difficulty === 'medium') {
      isCorrect = isCorrectHour12 && inputMinuteNum === currentMinute;
    } else if (difficulty === 'hard') {
      isCorrect = isCorrectHour12 && inputMinuteNum === currentMinute && inputSecondNum === currentSecond;
    } else if (difficulty === 'veryhard') {
      isCorrect = isCorrectHour12 &&
        inputMinuteNum === currentMinute &&
        inputSecondNum === currentSecond &&
        is24HourCorrect;
    }
    setMessage(isCorrect ? '정답입니다' : '틀렸습니다');
    setColor(isCorrect ? 'green' : 'red');
  };

  const radius = 200;
  const centerX = radius;
  const centerY = radius;
  const hourHandLength = radius * 0.5;
  const minuteHandLength = radius * 0.7;
  const secondHandLength = radius * 0.85;
  const tickLength = radius * 0.1;
  const majorTickLength = radius * 0.2;

  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();

  const hourAngle = ((hour + (difficulty === 'easy' || difficulty === 'veryeasy' ? 0 : minute / 60)) / 12) * 360;
  const minuteAngle = ((minute + (difficulty === 'easy' || difficulty === 'veryeasy' ? 0 : second / 60)) / 60) * 360;
  const secondAngle = (second / 60) * 360;


  const calculateHandPosition = (angle, length) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + length * Math.cos(radian),
      y: centerY + length * Math.sin(radian),
    };
  };

  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i < 360; i += 6) {
      const angle = i;
      const { x: xStart, y: yStart } = calculateHandPosition(angle, radius - tickLength);
      const { x: xEnd, y: yEnd } = calculateHandPosition(angle, radius - majorTickLength);
      const isMajorTick = i % 30 === 0;
      ticks.push(
        <line
          key={i}
          x1={xStart}
          y1={yStart}
          x2={xEnd}
          y2={yEnd}
          stroke="black"
          strokeWidth={isMajorTick ? 3 : 1}
        />
      );
    }
    return ticks;
  };

  const renderMinuteNumbers = () => {
    const numbers = [];
    for (let i = 0; i < 60; i += 5) {
      const angle = (i / 60) * 360;
      const { x, y } = calculateHandPosition(angle, radius - majorTickLength - 45); // 조정된 위치
      numbers.push(
        <text
          key={i}
          x={x}
          y={y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="12"
          fill="blue"
        >
          {i}
        </text>
      );
    }
    return numbers;
  };

  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i - 3) * 30 + 90;
      const { x, y } = calculateHandPosition(angle, radius - majorTickLength - 20);
      numbers.push(
        <text
          key={i}
          x={x}
          y={y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="24"
          fill="black"
        >
          {i}
        </text>
      );
    }
    return numbers;
  };

  const { x: hourX, y: hourY } = calculateHandPosition(hourAngle, hourHandLength);
  const { x: minuteX, y: minuteY } = calculateHandPosition(minuteAngle, minuteHandLength);
  const { x: secondX, y: secondY } = calculateHandPosition(secondAngle, secondHandLength);

  return (
    <div>
      <svg width="400" height="400" viewBox="0 0 400 400" className='clock'>
        <circle cx={centerX} cy={centerY} r={radius} stroke="black" strokeWidth="2" fill="none" />
        <circle cx={centerX} cy={centerY} r="3" fill="black" />
        {renderTicks()}
        {renderNumbers()}
        {difficulty !== 'veryeasy' && difficulty !== 'hard' && difficulty !== 'veryhard' && renderMinuteNumbers()}
        <line x1={centerX} y1={centerY} x2={hourX} y2={hourY} stroke="black" strokeWidth="3" />
        {difficulty !== 'veryeasy' && <line x1={centerX} y1={centerY} x2={minuteX} y2={minuteY} stroke="blue" strokeWidth="2" />}
        {difficulty !== 'veryeasy' && difficulty !== 'easy' && <line x1={centerX} y1={centerY} x2={secondX} y2={secondY} stroke="red" strokeWidth="1" />}
      </svg>
      {difficulty !== 'current' && (
        <div className="input-section">
          <div className="input-container">
            {difficulty === 'veryhard' && (
              <p>{isAM ? '오전' : '오후'}</p>
            )}
            <input
              type="text"
              value={inputHour}
              onChange={handleInputChange(setInputHour)}
              placeholder="시"
            />
            {difficulty !== 'veryeasy' && (
              <input
                type="text"
                value={inputMinute}
                onChange={handleInputChange(setInputMinute)}
                placeholder="분"
              />
            )}
            {difficulty !== 'veryeasy' && difficulty !== 'easy' && difficulty !== 'medium' && (
              <input
                type="text"
                value={inputSecond}
                onChange={handleInputChange(setInputSecond)}
                placeholder="초"
              />
            )}
            {difficulty === 'veryhard' && (
              <input
                type="text"
                value={input24Hour}
                onChange={handleInputChange(setInput24Hour)}
                placeholder="24시간제 시"
              />
            )}
           
            <button onClick={checkAnswer}>확인</button>
          </div>
          <div className='answer' style={{ color }}>{message}</div>
        </div>
      )}
    </div>
  );
};

export default Clock;
