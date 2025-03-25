import React from 'react';
import styled from 'styled-components';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const CodeArea = styled.pre`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 60vh;
  font-family: 'Consolas', monospace;
  margin: 10px 0;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const Title = styled.h2`
  margin-top: 0;
  color: #333;
`;

const CodePopup = ({ code, onClose }) => {
  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <Title>Python Tree Structure</Title>
        <CodeArea>{code}</CodeArea>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </PopupContent>
    </PopupOverlay>
  );
};

export default CodePopup; 