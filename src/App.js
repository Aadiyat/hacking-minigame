import React from 'react';
import './App.css';

import Screen from './components/Screen';
import Welcome from './components/Welcome';

function App() {
  return (
    <div className="App">
      <Welcome/>
      <Screen/>
    </div>
  );
}

export default App;
