import React, { useEffect, useState } from 'react';
import '../styles/Clock.css'; // CSS 파일을 불러옵니다.

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const radius = 100;
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

  const hourAngle = ((hour + minute / 60) / 12) * 360;
  const minuteAngle = ((minute + second / 60) / 60) * 360;
  const secondAngle = (second / 60) * 360;

  const calculateHandPosition = (angle, length) => {
    const radian = (angle - 90) * (Math.PI / 180); // 각도를 라디안으로 변환하고 시계 방향으로 조정
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
      const isMajorTick = i % 30 === 0; // 30도마다 굵은 눈금
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

  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i - 3) * 30 + 90; // 12시 방향을 0도로 하고, 시계 방향으로 30도씩 증가 (90도 회전 추가)
      const { x, y } = calculateHandPosition(angle, radius - majorTickLength - 20);
      numbers.push(
        <text
          key={i}
          x={x}
          y={y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="12"
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
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle cx={centerX} cy={centerY} r={radius} stroke="black" strokeWidth="2" fill="none" />
      <circle cx={centerX} cy={centerY} r="3" fill="black" />
      {renderTicks()}
      {renderNumbers()} {/* 숫자를 렌더링합니다 */}
      <line x1={centerX} y1={centerY} x2={hourX} y2={hourY} stroke="black" strokeWidth="3" />
      <line x1={centerX} y1={centerY} x2={minuteX} y2={minuteY} stroke="blue" strokeWidth="2" />
      <line x1={centerX} y1={centerY} x2={secondX} y2={secondY} stroke="red" strokeWidth="1" />
    </svg>
  );
};

export default Clock;
