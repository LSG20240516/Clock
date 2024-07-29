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
  const [showAnswer, setShowAnswer] = useState(false);

  const generateNewProblem = () => {
    const randomTime = new Date();
    randomTime.setHours(Math.floor(Math.random() * 24));
    randomTime.setMinutes(Math.floor(Math.random() * 60));
    randomTime.setSeconds(Math.floor(Math.random() * 60));
    setTime(randomTime);
    setIsAM(randomTime.getHours() < 12);
    resetAnswer();
  };

  useEffect(() => {
    if (difficulty === 'current') {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      generateNewProblem();
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

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const checkAnswer = () => {
    const currentHour24 = time.getHours();
    const currentMinute = time.getMinutes();
    const currentSecond = time.getSeconds();
    const currentHour12 = (currentHour24 % 12) || 12;

    const inputHourNum = parseInt(inputHour, 10);
    const inputMinuteNum = parseInt(inputMinute, 10);
    const inputSecondNum = parseInt(inputSecond, 10);
    const input24HourNum = parseInt(input24Hour, 10);

    let adjusted24Hour = input24HourNum;
    if (isAM && adjusted24Hour === 12) {
      adjusted24Hour = 0;
    } else if (!isAM && adjusted24Hour < 12) {
      adjusted24Hour += 12;
    }
    const is24HourCorrect = adjusted24Hour === currentHour24;

    const isCorrectHour12 = inputHourNum === currentHour12;

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

  const revealAnswer = () => {
    setShowAnswer(true);
    if (difficulty === 'veryeasy') {
      setInputHour(time.getHours() % 12 || 12);
    } else if (difficulty === 'easy' || difficulty === 'medium') {
      setInputHour(time.getHours() % 12 || 12);
      setInputMinute(time.getMinutes());
    } else if (difficulty === 'hard') {
      setInputHour(time.getHours() % 12 || 12);
      setInputMinute(time.getMinutes());
      setInputSecond(time.getSeconds());
    } else if (difficulty === 'veryhard') {
      setInputHour(time.getHours() % 12 || 12);
      setInputMinute(time.getMinutes());
      setInputSecond(time.getSeconds());
      setInput24Hour(time.getHours());
    }
    setIsAM(time.getHours() < 12);
  };

  const resetAnswer = () => {
    setShowAnswer(false);
    setInputHour('');
    setInputMinute('');
    setInputSecond('');
    setInput24Hour('');
    setMessage('');
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
      const { x, y } = calculateHandPosition(angle, radius - majorTickLength - 45);
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
      <svg width="400" height="400" viewBox="0 0 400 400">
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
              value={showAnswer ? (time.getHours() % 12 || 12) : inputHour}
              onChange={handleInputChange(setInputHour)}
              placeholder="시"
              readOnly={showAnswer}
            />
            {difficulty === 'veryhard' && (
              <input
                type="text"
                value={showAnswer ? time.getHours() : input24Hour}
                onChange={handleInputChange(setInput24Hour)}
                placeholder="24시간제 시"
                readOnly={showAnswer}
              />
            )}
            {difficulty !== 'veryeasy' && (
              <input
                type="text"
                value={showAnswer ? time.getMinutes() : inputMinute}
                onChange={handleInputChange(setInputMinute)}
                placeholder="분"
                readOnly={showAnswer}
              />
            )}
            {difficulty !== 'veryeasy' && difficulty !== 'easy' && difficulty !== 'medium' && (
              <input
                type="text"
                value={showAnswer ? time.getSeconds() : inputSecond}
                onChange={handleInputChange(setInputSecond)}
                placeholder="초"
                readOnly={showAnswer}
              />
            )}
            <button onClick={checkAnswer}>확인</button>
            <button onClick={resetAnswer}>리셋</button>
            <button onClick={revealAnswer}>정답 보기</button>    
            <button onClick={generateNewProblem}>새 문제</button>
          </div>
          <div className='answer' style={{ color }}>{message}</div>
          {showAnswer && (
            <div className='correct-answer'>
              {difficulty === 'veryeasy' && (
                <p>정답: {time.getHours() % 12 || 12}시</p>
              )}
              {(difficulty === 'easy' || difficulty === 'medium') && (
                <p>정답: {time.getHours() % 12 || 12}시 {time.getMinutes()}분</p>
              )}
              {difficulty === 'hard' && (
                <p>정답: {time.getHours() % 12 || 12}시 {time.getMinutes()}분 {time.getSeconds()}초</p>
              )}
              {difficulty === 'veryhard' && (
                <>
                  <p>정답: {time.getHours() % 12 || 12}시 {time.getMinutes()}분 {time.getSeconds()}초</p>
                  <p>24시간제: {time.getHours()}시</p>
                </>
              )}
              <p>{time.getHours() < 12 ? '오전' : '오후'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Clock;