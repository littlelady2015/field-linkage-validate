import React from 'react';
import logo from './logo.svg';
import './App.css';
import relyField from './dataSet';
import { matchSingleRule } from './validate';
function App() {
  // let result = contains(relyField.displayContent, relyField.hideContent);
  let result = matchSingleRule(relyField);
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          { result.toString() } 
        </h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
