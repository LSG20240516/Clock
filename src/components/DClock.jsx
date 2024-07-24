import React, { useState, useEffect } from 'react';

function DClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h1>Digital Clock</h1>
      <span>{time.toLocaleTimeString()}</span>
    </div>
  );
}

export default DClock;
