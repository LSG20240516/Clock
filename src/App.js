import React from 'react';
import Clock from './components/Clock';
import DClock from './components/DClock';

const App = () => {
  return (
    <div>
      <h1>Analog Clock</h1>
      <Clock />
      <DClock />
    </div>
  );
};

export default App;
