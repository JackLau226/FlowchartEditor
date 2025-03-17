import React from 'react';
import {
  ToolbarContainer,
  ToolbarGroup,
  Button,
  ColorControls,
  ColorPicker,
  Select,
  Label
} from '../styles';

const Toolbar = ({
  createShape,
  selectedNode,
  nodeColors,
  updateNodeColor,
  selectedLink,
  currentLineStyle,
  updateSelectedLinkStyle,
  showTextRepresentation,
  showTurtle,
  toggleTextRepresentation,
  toggleTurtle
}) => {
  return (
    <ToolbarContainer>
      <ToolbarGroup>
        <Button onClick={() => createShape('State')}>Add State</Button>
        <Button onClick={() => createShape('Process')}>Add Process</Button>
        <Button onClick={() => createShape('Decision')}>Add Decision</Button>
        {selectedNode && (
          <ColorControls>
            <Label>Text:</Label>
            <ColorPicker
              type="color"
              value={nodeColors.text}
              onChange={(e) => updateNodeColor('text', e.target.value)}
            />
            <Label>Border:</Label>
            <ColorPicker
              type="color"
              value={nodeColors.border}
              onChange={(e) => updateNodeColor('border', e.target.value)}
            />
          </ColorControls>
        )}

        {selectedLink && (
          <ColorControls>
            <Label>Line Style:</Label>
            <Select 
              value={currentLineStyle}
              onChange={(e) => updateSelectedLinkStyle(e.target.value)}
            >
              <option value="straight">Straight</option>
              <option value="jump">Jump Over</option>
            </Select>
          </ColorControls>
        )}
      </ToolbarGroup>
      <ToolbarGroup className="right">
        <Button onClick={toggleTextRepresentation}>
          {showTextRepresentation ? 'Hide Text' : 'Show Text'}
        </Button>
        <Button onClick={toggleTurtle}>
          {showTurtle ? 'Hide Turtle' : 'Show Turtle'}
        </Button>
      </ToolbarGroup>
    </ToolbarContainer>
  );
};

export default Toolbar;
