// src/components/GraphEditor/components/VariablePopup.js
import React, { useState } from 'react';
import { PopupContainer, PopupOverlay, CloseButton } from '../styles';

const VariablePopup = ({ isOpen, onClose, variables, setVariables }) => {
  const [varName, setVarName] = useState('');
  const [varValue, setVarValue] = useState('');

  const addVariable = () => {
    if (varName) {
      let value;
      // Determine the type of the variable
      if (varValue === 'true' || varValue === 'false') {
        value = varValue === 'true'; // Convert to boolean
      } else if (!isNaN(varValue) && varValue.trim() !== '') {
        value = parseInt(varValue, 10); // Convert to integer
      } else {
        alert('Please enter a valid integer or boolean (true/false).');
        return;
      }

      setVariables(prev => ({ ...prev, [varName]: value }));
      setVarName('');
      setVarValue('');
    }
  };

  const deleteVariable = (name) => {
    setVariables(prev => {
      const newVariables = { ...prev };
      delete newVariables[name];
      return newVariables;
    });
  };

  if (!isOpen) return null;

  return (
    <PopupOverlay>
      <PopupContainer>
        <h3>User-defined Variables</h3>
        <input
          type="text"
          placeholder="Variable Name"
          value={varName}
          size="10"
          onChange={(e) => setVarName(e.target.value)}
        />
        <span style={{ marginLeft: '10px' }}></span>
        <input
          type="text"
          placeholder="Variable Value"
          value={varValue}
          size="10"
          onChange={(e) => setVarValue(e.target.value)}
        />
        <span style={{ marginLeft: '10px' }}></span>
        <button onClick={addVariable}>Add Variable</button>
        
        <div>
          <h4>Current Variables:</h4>
          <ul>
            {Object.entries(variables).map(([key, value]) => (
              <li key={key}>
                {key} : {value.toString()} ({typeof value})
                <span style={{ marginLeft: '10px' }}></span> 
                <button onClick={() => deleteVariable(key)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default VariablePopup;