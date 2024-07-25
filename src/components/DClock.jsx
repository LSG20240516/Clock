import { useState, useEffect } from 'react';
import '../styles/DClock.css';

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
      <h1 className='dctitle'></h1>
      <div className='dclock'>
        <span>{time.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

export default DClock;
