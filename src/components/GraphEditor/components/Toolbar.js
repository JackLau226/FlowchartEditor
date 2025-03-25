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

const ShapeButtons = ({ createShape }) => (
  <>
    <Button onClick={() => createShape('State')}>Add State</Button>
    <Button onClick={() => createShape('Process')}>Add Process</Button>
    <Button onClick={() => createShape('Decision')}>Add Decision</Button>
  </>
);

const StateTypeControl = ({ selectedNode, updateStateType }) => (
  <ColorControls>
    <Label>State Type:</Label>
    <Select 
      value={selectedNode.data.stateType || 'normal'}
      onChange={(e) => updateStateType(e.target.value)}
    >
      <option value="normal">Normal</option>
      <option value="start">Start State</option>
      <option value="end">End State</option>
    </Select>
  </ColorControls>
);

const ColorControl = ({ label, value, onChange }) => (
  <>
    <Label>{label}:</Label>
    <ColorPicker type="color" value={value} onChange={onChange} />
  </>
);

const LinkStyleControl = ({ currentLineStyle, updateSelectedLinkStyle, selectedLink, updateBranchType }) => (
  <ColorControls>
    <Label>Line Style:</Label>
    <Select 
      value={currentLineStyle}
      onChange={(e) => updateSelectedLinkStyle(e.target.value)}
    >
      <option value="straight">Straight</option>
      <option value="jump">Jump Over</option>
    </Select>
    {selectedLink.fromNode?.data.figure === 'Diamond' && (
      <>
        <Label>Branch Type:</Label>
        <Select
          value={selectedLink.data.branchType || 'true'}
          onChange={(e) => updateBranchType(e.target.value)}
        >
          <option value="true">True Branch</option>
          <option value="false">False Branch</option>
        </Select>
      </>
    )}
  </ColorControls>
);

const Toolbar = ({
  createShape,
  selectedNode,
  nodeColors,
  updateNodeColor,
  selectedLink,
  currentLineStyle,
  updateSelectedLinkStyle,
  showAST,
  toggleAST,
  updateStateType,
  updateBranchType,
  toggleVariablePopup,
  toggleExamplePopup
}) => (
  <ToolbarContainer>
    <ToolbarGroup>
      <ShapeButtons createShape={createShape} />
      
      {selectedNode && (
        <>
          {selectedNode.data.figure === 'Ellipse' && (
            <StateTypeControl 
              selectedNode={selectedNode}
              updateStateType={updateStateType}
            />
          )}
          <ColorControls>
            <ColorControl 
              label="Text"
              value={nodeColors.text}
              onChange={(e) => updateNodeColor('text', e.target.value)}
            />
            <ColorControl 
              label="Border"
              value={nodeColors.border}
              onChange={(e) => updateNodeColor('border', e.target.value)}
            />
          </ColorControls>
        </>
      )}

      {selectedLink && (
        <LinkStyleControl 
          currentLineStyle={currentLineStyle}
          updateSelectedLinkStyle={updateSelectedLinkStyle}
          selectedLink={selectedLink}
          updateBranchType={updateBranchType}
        />
      )}
    </ToolbarGroup>
    
    <ToolbarGroup className="right">
      <Button onClick={toggleExamplePopup}>Example</Button>
      <Button onClick={toggleAST}>
        {showAST ? 'Hide AST' : 'Show AST'}
      </Button>
      <Button onClick={toggleVariablePopup}>Custom Variables</Button>
    </ToolbarGroup>
  </ToolbarContainer>
);

export default Toolbar;
