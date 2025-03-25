import React from 'react';
import { PopupContainer, PopupOverlay, CloseButton } from '../styles';

const ExamplePopup = ({ isOpen, onClose, loadExample }) => {
  if (!isOpen) return null;

  const examples = [
    { name: 'Process Flow', id: 'process-flow' },
    { name: 'Decision Tree', id: 'decision-tree' },
    { name: 'Simple Loop', id: 'simple-loop' }
  ];

  return (
    <PopupOverlay>
      <PopupContainer>
        <h3>Flowchart Examples</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {examples.map(example => (
            <button
              key={example.id}
              onClick={() => {
                loadExample(example.id);
                onClose();
              }}
              style={{
                padding: '8px 16px',
                background: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {example.name}
            </button>
          ))}
        </div>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default ExamplePopup; 