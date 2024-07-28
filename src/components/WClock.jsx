import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from 'styled-components';

const ClockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 20px;
  max-width: 400px;
  width: 100%;
`;

const ClockSVG = styled.svg`
  width: 100%; // SVG를 컨테이너에 맞게 조정
  height: auto; // 비율 유지
  max-width: 300px; // 시계 최대 크기 조정
`;

const Button = styled.button`
  padding: 10px 20px; // 버튼 크기 조정
  font-size: 1.2rem; // 버튼 폰트 크기 조정
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  border-radius: 5px;
  transition: background-color 0.3s;
  color: black; // 버튼 폰트 색상 검은색으로 변경

  &:hover {
    background-color: #ddd;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 20px; // 버튼 사이의 여백 조정
  display: flex;
  gap: 10px; // 버튼 사이의 간격 조정
`;

const timeZones = [
  { name: "현지 시간", value: Intl.DateTimeFormat().resolvedOptions().timeZone, flag: "🏠", offset: -new Date().getTimezoneOffset() / 60 },
  { name: "뉴욕", value: "America/New_York", flag: "🇺🇸", offset: -4 },
  { name: "런던", value: "Europe/London", flag: "🇬🇧", offset: 1 },
  { name: "도쿄", value: "Asia/Tokyo", flag: "🇯🇵", offset: 9 },
  { name: "시드니", value: "Australia/Sydney", flag: "🇦🇺", offset: 10 },
  { name: "서울", value: "Asia/Seoul", flag: "🇰🇷", offset: 9 },
  { name: "파리", value: "Europe/Paris", flag: "🇫🇷", offset: 2 },
  { name: "모스크바", value: "Europe/Moscow", flag: "🇷🇺", offset: 3 },
  { name: "베이징", value: "Asia/Shanghai", flag: "🇨🇳", offset: 8 },
  { name: "로스앤젤레스", value: "America/Los_Angeles", flag: "🇺🇸", offset: -7 },
  { name: "시카고", value: "America/Chicago", flag: "🇺🇸", offset: -5 },
  { name: "홍콩", value: "Asia/Hong_Kong", flag: "🇭🇰", offset: 8 },
  { name: "싱가포르", value: "Asia/Singapore", flag: "🇸🇬", offset: 8 },
  { name: "마닐라", value: "Asia/Manila", flag: "🇵🇭", offset: 8 },
  { name: "하노이", value: "Asia/Ho_Chi_Minh", flag: "🇻🇳", offset: 7 },
  { name: "방콕", value: "Asia/Bangkok", flag: "🇹🇭", offset: 7 },
  { name: "델리", value: "Asia/Kolkata", flag: "🇮🇳", offset: 5.5 },
  { name: "카이로", value: "Africa/Cairo", flag: "🇪🇬", offset: 2 },
  { name: "케이프타운", value: "Africa/Johannesburg", flag: "🇿🇦", offset: 2 },
  { name: "리우데자네이루", value: "America/Sao_Paulo", flag: "🇧🇷", offset: -3 },
];

const WClock = ({ initialTimeZone }) => {
  const [time, setTime] = useState(() => new Date());
  const [isRunning, setIsRunning] = useState(true);
  const [selectedTimeZone, setSelectedTimeZone] = useState(initialTimeZone);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(new Date());
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleTimeZoneChange = useCallback((event) => {
    setSelectedTimeZone(event.target.value);
  }, []);

  const resetTimeHandler = useCallback(() => {
    setTime(new Date());
    setIsRunning(true);
    setSelectedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const toggleRunning = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const clockConfig = useMemo(
    () => ({
      radius: 150, // 시계 반지름 조정
      centerX: 150, // 시계 중심 x 좌표
      centerY: 150, // 시계 중심 y 좌표
      hourHandLength: 100, // 시계 바늘 길이 조정
      minuteHandLength: 120,
      secondHandLength: 140,
      tickLength: 10,
      majorTickLength: 20,
    }),
    []
  );

  const calculateHandPosition = useCallback(
    (angle, length) => {
      const radian = (angle - 90) * (Math.PI / 180);
      return {
        x: clockConfig.centerX + length * Math.cos(radian),
        y: clockConfig.centerY + length * Math.sin(radian),
      };
    },
    [clockConfig]
  );

  const renderTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i < 360; i += 6) {
      const { x: xStart, y: yStart } = calculateHandPosition(
        i,
        clockConfig.radius - clockConfig.tickLength
      );
      const { x: xEnd, y: yEnd } = calculateHandPosition(i, clockConfig.radius);
      const isMajorTick = i % 30 === 0;
      ticks.push(
        <line
          key={i}
          x1={xStart}
          y1={yStart}
          x2={xEnd}
          y2={yEnd}
          stroke="black"
          strokeWidth={isMajorTick ? 4 : 1}
        />
      );
    }
    return ticks;
  }, [calculateHandPosition, clockConfig]);

  const renderNumbers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = i * 30;
      const { x, y } = calculateHandPosition(
        angle,
        clockConfig.radius - clockConfig.majorTickLength - 20
      );
      return (
        <text
          key={i + 1}
          x={x}
          y={y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="20" // 숫자 크기 조정
          fill="black"
        >
          {i === 0 ? 12 : i}
        </text>
      );
    });
  }, [calculateHandPosition, clockConfig]);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const localTime = new Date(time.toLocaleString("en-US", { timeZone: selectedTimeZone }));
    const hour = localTime.getHours() % 12;
    const minute = localTime.getMinutes();
    const second = localTime.getSeconds();
    return {
      hourAngle: ((hour + minute / 60) / 12) * 360,
      minuteAngle: (minute / 60) * 360,
      secondAngle: (second / 60) * 360,
    };
  }, [time, selectedTimeZone]);

  const { x: hourX, y: hourY } = calculateHandPosition(
    hourAngle,
    clockConfig.hourHandLength
  );
  const { x: minuteX, y: minuteY } = calculateHandPosition(
    minuteAngle,
    clockConfig.minuteHandLength
  );
  const { x: secondX, y: secondY } = calculateHandPosition(
    secondAngle,
    clockConfig.secondHandLength
  );

  const formattedTime = useMemo(() => {
    try {
      return new Date().toLocaleTimeString("ko-KR", {
        timeZone: selectedTimeZone,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return new Date().toLocaleTimeString("ko-KR");
    }
  }, [time, selectedTimeZone]);

  return (
    <ClockContainer>
      <ClockSVG
        className="clock-svg"
        width={clockConfig.radius * 2}
        height={clockConfig.radius * 2}
      >
        <circle
          cx={clockConfig.centerX}
          cy={clockConfig.centerY}
          r={clockConfig.radius}
          stroke="black"
          strokeWidth="2"
          fill="white"
        />
        {renderTicks}
        {renderNumbers}
        <line
          x1={clockConfig.centerX}
          y1={clockConfig.centerY}
          x2={hourX}
          y2={hourY}
          stroke="black"
          strokeWidth="4"
        />
        <line
          x1={clockConfig.centerX}
          y1={clockConfig.centerY}
          x2={minuteX}
          y2={minuteY}
          stroke="black"
          strokeWidth="2"
        />
        <line
          x1={clockConfig.centerX}
          y1={clockConfig.centerY}
          x2={secondX}
          y2={secondY}
          stroke="red"
          strokeWidth="1"
        />
        <circle
          cx={clockConfig.centerX}
          cy={clockConfig.centerY}
          r="4"
          fill="black"
        />
      </ClockSVG>
      <div>{formattedTime}</div>
      <div>
        <select onChange={handleTimeZoneChange} value={selectedTimeZone}>
          {timeZones.map((zone) => (
            <option key={zone.value} value={zone.value}>
              {zone.flag} {zone.name}
            </option>
          ))}
        </select>
      </div>
      <ButtonContainer>
        <Button onClick={resetTimeHandler}>시간 재설정</Button>
        <Button onClick={toggleRunning}>
          {isRunning ? "멈추기" : "시작"}
        </Button>
      </ButtonContainer>
    </ClockContainer>
  );
};

export default WClock;
