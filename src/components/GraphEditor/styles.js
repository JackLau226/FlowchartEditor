import styled from 'styled-components';

export const EditorContainer = styled.div`
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  background: #fff;
  position: relative;
  cursor: grab;
  margin-bottom: 10px;
`;

export const ToolbarContainer = styled.div`
  padding: 10px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  &.right {
    margin-left: auto;
  }
`;

export const ColorControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  background: #f5f5f5;
  border-radius: 4px;
  height: 35px;
`;

export const Button = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? '#357abd' : '#4a90e2'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  height: 35px;

  &:hover {
    background: #357abd;
  }
`;

export const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  height: 35px;
`;

export const ColorPicker = styled.input`
  padding: 2px;
  width: 35px;
  height: 35px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: none;
    border-radius: 2px;
  }
`;

export const Label = styled.label`
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
`;

export const TextRepresentation = styled.div`
  margin-top: 10px;
  padding: 15px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;

  .selected {
    color: rgb(100,150,255);
    font-weight: bold;
  }

  .connection {
    margin: 4px 0;
    padding: 4px;
  }

  .connection-type {
    color: #666;
    font-style: italic;
    margin-left: 8px;
  }
`;

export const GridControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: flex-end;
`;

export const Checkbox = styled.input`
  margin-right: 5px;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const PopupContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 350px;
`;

export const CloseButton = styled.button`
  background:rgb(241, 110, 110);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 12px;
  margin-top: 10px;

  &:hover {
    background: #ff1a1a;
  }
`;

export const ValidationStatus = styled.div`
  margin: 10px 0;
  padding: 8px;
  text-align: center;
  font-weight: bold;
  color: ${props => props.isValid ? '#4CAF50' : '#F44336'};
  
  ul {
    font-weight: normal;
    font-size: 14px;
    margin-top: 8px;
  }

  li {
    margin: 4px 0;
  }
`;
