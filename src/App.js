import React from 'react';
import './App.css';

import Game from './components/Screen';
import Welcome from './components/Welcome';

function App() {
  return (
    <div className="App">
      <Welcome/>
      <Game/>
    </div>
  );
}

export default App;
