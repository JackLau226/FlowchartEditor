/**
 * Main Application Component
 * 
 * The root component of the flow chart editor application.
 * Provides the basic structure and renders the editor.
 */

import React from 'react';
import './App.css';
import GraphEditor from './components/GraphEditor/GraphEditor';

/**
 * App Component
 * Renders the main graph editor interface
 */
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
