/**
 * Flow Chart Editor Component
 * 
 * This is the main component that handles the flow chart creation and editing.
 * It uses GoJS library to manage the interactive diagram.
 * 
 * Features:
 * - Create and edit flow chart diagrams
 * - Add different types of nodes (State, Process, Decision)
 * - Connect nodes with arrows
 * - Change colors and styles
 * - Toggle grid for better alignment
 * - View diagram in text and Turtle format
 */

import React, { useRef, useEffect, useState } from 'react';
import * as go from 'gojs';
import { EditorContainer, TextRepresentation, GridControls, Label, Checkbox, ValidationStatus, Button } from './styles';
import Toolbar from './components/Toolbar';
import { createNodeTemplate } from './templates/nodeTemplate';
import { createLinkTemplate } from './templates/linkTemplate';
import { createNodeData, generateTextRepresentation, showPorts, hidePorts, generatePythonCode } from './utils/diagramUtils';
import { generateASTRepresentation } from './utils/astUtils';
import { handleSelectionChanged, handleLinkingToolActivation, handleRelinkingToolActivation } from './utils/eventHandlers';
import { createDiagramConfig } from './utils/diagramConfig';
import VariablePopup from './components/VariablePopup';
import { validateFlowchart } from './utils/flowchartValidation';
import { simulateFlowchart, generateSimulationText } from './utils/simulationLogic';
import ExamplePopup from './components/ExamplePopup';
import { exampleFlowcharts } from './utils/exampleFlowcharts';
import CodePopup from './components/CodePopup';

/**
 * Grid Toggle Component
 * A simple checkbox that lets users show or hide the alignment grid
 */
const GridToggle = ({ showGrid, toggleGrid }) => (
  <GridControls>
    <Label>
      <Checkbox type="checkbox" checked={showGrid} onChange={toggleGrid} />
      Grid Lines
    </Label>
  </GridControls>
);

/**
 * Graph Editor Component
 * The main component that handles all diagram operations
 */
const GraphEditor = () => {
  const diagramRef = useRef(null);
  const [diagram, setDiagram] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeColors, setNodeColors] = useState({ text: '#000000', border: '#000000' });
  const [selectedLink, setSelectedLink] = useState(null);
  const [currentLineStyle, setCurrentLineStyle] = useState('straight');
  const [showAST, setShowAST] = useState(false);
  const [astRepresentation, setASTRepresentation] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [variables, setVariables] = useState({});
  const [isVariablePopupOpen, setIsVariablePopupOpen] = useState(false);
  const [validationStatus, setValidationStatus] = useState({ isValid: false, errors: [] });
  const [simulationResult, setSimulationResult] = useState(null);
  const [isExamplePopupOpen, setIsExamplePopupOpen] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [pythonCode, setPythonCode] = useState('');

  /**
   * Updates the type of a selected state node
   * @param type - The new state type ('start', 'end', or 'normal')
   */
  const updateStateType = (type) => {
    if (!selectedNode || !diagram) return;
    diagram.startTransaction('update state type');
    diagram.model.setDataProperty(diagram.model.findNodeDataForKey(selectedNode.key), "stateType", type);
    diagram.commitTransaction('update state type');
  };

  /**
   * Updates the color of a selected node
   * @param type - Which color to update ('text' or 'border')
   * @param color - The new color value
   */
  const updateNodeColor = (type, color) => {
    if (!selectedNode || !diagram) return;
    diagram.startTransaction('update color');
    const data = diagram.model.findNodeDataForKey(selectedNode.key);
    diagram.model.setDataProperty(data, type === 'text' ? "textColor" : "borderColor", color);
    setNodeColors(prev => ({ ...prev, [type]: color }));
    diagram.commitTransaction('update color');
  };

  /**
   * Toggles the grid visibility on/off
   */
  const toggleGrid = () => {
    if (diagram) {
      diagram.startTransaction('toggle grid');
      diagram.grid.visible = !showGrid;
      setShowGrid(!showGrid);
      diagram.commitTransaction('toggle grid');
    }
  };

  /**
   * Creates a new shape in the diagram
   * @param shape - The type of shape to create
   */
  const createShape = (shape) => {
    if (!diagram) return;
    diagram.model.addNodeData(createNodeData(shape));
  };

  /**
   * Updates the style of the currently selected link
   * @param style - The new style to apply
   */
  const updateSelectedLinkStyle = (style) => {
    if (!selectedLink || !diagram) return;
    diagram.startTransaction('update line style');
    const routing = style === 'straight' ? go.Link.Normal : go.Link.AvoidsNodes;
    const curve = style === 'straight' ? go.Link.None : go.Link.JumpOver;
    selectedLink.routing = routing;
    selectedLink.curve = curve;
    diagram.model.setDataProperty(selectedLink.data, "routing", routing);
    setCurrentLineStyle(style);
    diagram.commitTransaction('update line style');
  };

  /**
   * Toggles the AST representation view
   */
  const toggleAST = () => {
    setShowAST(prev => {
      const newState = !prev;
      if (newState && diagram) setASTRepresentation(generateASTRepresentation(diagram));
      return newState;
    });
  };

  const updateBranchType = (type) => {
    if (!selectedLink || !diagram) return;
    diagram.startTransaction('update branch type');
    diagram.model.setDataProperty(selectedLink.data, "branchType", type);
    diagram.commitTransaction('update branch type');
    setSelectedLink({ ...selectedLink });
  };

  const validateDiagram = () => {
    if (!diagram) return;
    const validation = validateFlowchart(diagram);
    setValidationStatus(validation);
    return validation;
  };

  const handleSimulate = () => {
    if (!diagram) return;
    setSimulationResult(simulateFlowchart(diagram, variables));
  };

  const loadExample = (exampleId) => {
    if (!diagram || !exampleFlowcharts[exampleId]) return;
    const example = exampleFlowcharts[exampleId];
    
    diagram.startTransaction('load example');
    diagram.nodes.each(node => diagram.remove(node));
    diagram.links.each(link => diagram.remove(link));
    
    example.nodes.forEach(node => diagram.model.addNodeData(node));
    example.links.forEach(link => diagram.model.addLinkData(link));
    diagram.commitTransaction('load example');
  };

  const handleGenerate = () => {
    setPythonCode(generatePythonCode(diagram));
    setShowCodePopup(true);
  };

  useEffect(() => {
    if (!diagramRef.current) return;

    const newDiagram = createDiagramConfig(diagramRef.current);
    newDiagram.nodeTemplate = createNodeTemplate(go.GraphObject.make, setSelectedNode, setNodeColors);
    newDiagram.linkTemplate = createLinkTemplate(go.GraphObject.make, setSelectedLink);

    newDiagram.addDiagramListener("ChangedSelection", e => 
      handleSelectionChanged(e, newDiagram, setSelectedNode, setNodeColors, setSelectedLink, setCurrentLineStyle)
    );

    handleLinkingToolActivation(newDiagram, setIsLinking);
    handleRelinkingToolActivation(newDiagram);

    setDiagram(newDiagram);
    return () => { newDiagram.div = null; };
  }, []);

  useEffect(() => {
    if (!diagram) return;

    const updateDiagram = () => {
      if (showAST) setASTRepresentation(generateASTRepresentation(diagram));
      validateDiagram();
      setSimulationResult(null);
    };

    diagram.addModelChangedListener(updateDiagram);
    diagram.addDiagramListener("ChangedSelection", updateDiagram);
    diagram.addDiagramListener("LinkDrawn", updateDiagram);
    diagram.addDiagramListener("LinkRelinked", updateDiagram);

    return () => {
      diagram.removeModelChangedListener(updateDiagram);
      diagram.removeDiagramListener("ChangedSelection", updateDiagram);
      diagram.removeDiagramListener("LinkDrawn", updateDiagram);
      diagram.removeDiagramListener("LinkRelinked", updateDiagram);
    };
  }, [diagram, showAST]);

  return (
    <div>
      <Toolbar
        createShape={createShape}
        selectedNode={selectedNode}
        nodeColors={nodeColors}
        updateNodeColor={updateNodeColor}
        selectedLink={selectedLink}
        currentLineStyle={currentLineStyle}
        updateSelectedLinkStyle={updateSelectedLinkStyle}
        showAST={showAST}
        toggleAST={toggleAST}
        updateStateType={updateStateType}
        updateBranchType={updateBranchType}
        toggleVariablePopup={() => setIsVariablePopupOpen(prev => !prev)}
        toggleExamplePopup={() => setIsExamplePopupOpen(prev => !prev)}
        validateDiagram={validateDiagram}
      />
      <EditorContainer ref={diagramRef} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <GridToggle showGrid={showGrid} toggleGrid={toggleGrid} />
        <ValidationStatus isValid={validationStatus.isValid} style={{ textAlign: 'center', flex: 1 }}>
          {validationStatus.isValid ? 'Valid ✓' : (
            <div>
              Invalid ✗
              <ul style={{ margin: '8px 0 0 0', padding: '0 0 0 20px', textAlign: 'left' }}>
                {validationStatus.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </ValidationStatus>
        <div style={{ marginLeft: 'auto' }}>
          <Button onClick={handleGenerate}>Generate Script</Button>
          <Button onClick={handleSimulate} style={{ marginLeft: '10px' }}>Simulate</Button>
        </div>
      </div>
      
      {simulationResult && (
        <TextRepresentation>
          <div style={{ marginBottom: '10px', color: simulationResult.isValid ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>
            {simulationResult.error ? 'Simulation Failed' : 
             simulationResult.completed ? 'Simulation Complete' : 'Simulation Interrupted'}
          </div>
          <div>{generateSimulationText(simulationResult.path, simulationResult.completed, simulationResult.variables, simulationResult.error)}</div>
        </TextRepresentation>
      )}
      
      {showAST && <TextRepresentation>{astRepresentation}</TextRepresentation>}

      <VariablePopup 
        isOpen={isVariablePopupOpen} 
        onClose={() => setIsVariablePopupOpen(false)} 
        variables={variables} 
        setVariables={setVariables} 
      />

      <ExamplePopup
        isOpen={isExamplePopupOpen}
        onClose={() => setIsExamplePopupOpen(false)}
        loadExample={loadExample}
      />

      {showCodePopup && (
        <CodePopup
          code={pythonCode}
          onClose={() => setShowCodePopup(false)}
        />
      )}
    </div>
  );
};

export default GraphEditor;
