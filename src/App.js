import React from 'react';
import './App.css';
import GraphEditor from './components/GraphEditor/GraphEditor';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Flow Chart Editor</h1>
      </header>
      <main style={{ height: 'calc(100vh - 100px)' }}>
        <GraphEditor />
      </main>
    </div>
  );
}

export default App;
