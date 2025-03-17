import React, { useRef, useEffect } from 'react';
import * as go from 'gojs';
import { EditorContainer, TextRepresentation, GridControls, Label, Checkbox } from './styles';
import Toolbar from './components/Toolbar';
import { createNodeTemplate } from './templates/nodeTemplate';
import { createLinkTemplate } from './templates/linkTemplate';
import {
  createNodeData,
  generateTextRepresentation,
  generateTurtleRepresentation,
  showPorts,
  hidePorts
} from './utils/diagramUtils';

const GridToggle = ({ showGrid, toggleGrid }) => {
  return (
    <GridControls>
      <Label>
        <Checkbox
          type="checkbox"
          checked={showGrid}
          onChange={toggleGrid}
        />
        Grid Lines
      </Label>
    </GridControls>
  );
};

const GraphEditor = () => {
  const diagramRef = useRef(null);
  const [diagram, setDiagram] = React.useState(null);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [nodeColors, setNodeColors] = React.useState({
    text: '#000000',
    border: '#000000'
  });
  const [selectedLink, setSelectedLink] = React.useState(null);
  const [currentLineStyle, setCurrentLineStyle] = React.useState('straight');
  const [showTextRepresentation, setShowTextRepresentation] = React.useState(false);
  const [showTurtle, setShowTurtle] = React.useState(false);
  const [textRepresentation, setTextRepresentation] = React.useState('');
  const [turtleRepresentation, setTurtleRepresentation] = React.useState('');
  const [isLinking, setIsLinking] = React.useState(false);
  const [showGrid, setShowGrid] = React.useState(true);

  const updateNodeColor = (type, color) => {
    if (!selectedNode || !diagram) return;
    
    diagram.startTransaction('update color');
    const data = diagram.model.findNodeDataForKey(selectedNode.key);
    
    if (type === 'text') {
      diagram.model.setDataProperty(data, "textColor", color);
      setNodeColors(prev => ({ ...prev, text: color }));
    } else if (type === 'border') {
      diagram.model.setDataProperty(data, "borderColor", color);
      setNodeColors(prev => ({ ...prev, border: color }));
    }
    
    diagram.commitTransaction('update color');
  };

  const toggleGrid = () => {
    if (diagram) {
      diagram.startTransaction('toggle grid');
      diagram.grid.visible = !showGrid;
      setShowGrid(!showGrid);
      diagram.commitTransaction('toggle grid');
    }
  };

  const createShape = (shape) => {
    if (!diagram) return;
    const nodeData = createNodeData(shape);
    diagram.model.addNodeData(nodeData);
  };

  const updateSelectedLinkStyle = (style) => {
    if (!selectedLink) return;
    diagram.startTransaction('update line style');
    diagram.model.setDataProperty(selectedLink.data, "routing", style);
    setCurrentLineStyle(style);
    diagram.commitTransaction('update line style');
  };

  const toggleTextRepresentation = () => {
    setShowTextRepresentation(prev => {
      const newState = !prev;
      if (newState && diagram) {
        setTextRepresentation(generateTextRepresentation(diagram));
      }
      return newState;
    });
  };

  const toggleTurtle = () => {
    setShowTurtle(prev => {
      const newState = !prev;
      if (newState && diagram) {
        setTurtleRepresentation(generateTurtleRepresentation(diagram));
      }
      return newState;
    });
  };

  useEffect(() => {
    if (!diagramRef.current) return;

    const $ = go.GraphObject.make;
    const newDiagram = $(go.Diagram, diagramRef.current, {
      initialContentAlignment: go.Spot.Center,
      "undoManager.isEnabled": true,
      allowDrop: true,
      scrollsPageOnFocus: false,
      "grid.visible": true,
      "grid.gridCellSize": new go.Size(20, 20),
      "draggingTool.dragsLink": true,
      "relinkingTool.isEnabled": true,
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      "linkingTool.direction": go.LinkingTool.ForwardsOnly,
      "linkingTool.portGravity": 20,
      "relinkingTool.portGravity": 20,
      "linkReshapingTool.handleArchetype":
        $(go.Shape, "Diamond", { width: 8, height: 8, fill: "lightblue" })
    });

    newDiagram.nodeTemplate = createNodeTemplate($, setSelectedNode, setNodeColors);
    newDiagram.linkTemplate = createLinkTemplate($);

    // Handle selection changes and linking tool state
    newDiagram.addDiagramListener("ChangedSelection", e => {
      const node = e.diagram.selection.first();
      if (node instanceof go.Node) {
        setSelectedNode(node);
        setNodeColors({
          text: node.data.textColor || '#000000',
          border: node.data.borderColor || '#000000'
        });

        // Show ports only on the selected node
        e.diagram.nodes.each(n => {
          if (n === node) {
            showPorts(n);
          } else {
            hidePorts(n);
          }
        });
      } else {
        setSelectedNode(null);
        // Hide all ports if no node is selected and not linking
        if (!isLinking) {
          e.diagram.nodes.each(n => hidePorts(n));
        }
      }

      const link = e.diagram.selection.first();
      if (link instanceof go.Link) {
        setSelectedLink(link);
        setCurrentLineStyle(link.data?.routing || 'straight');
      } else {
        setSelectedLink(null);
      }
    });

    newDiagram.toolManager.linkingTool.doActivate = function() {
      go.LinkingTool.prototype.doActivate.call(this);
      this.diagram.nodes.each(n => showPorts(n));
      setIsLinking(true);
    };

    newDiagram.toolManager.linkingTool.doDeactivate = function() {
      go.LinkingTool.prototype.doDeactivate.call(this);
      this.diagram.nodes.each(n => {
        if (!n.isSelected) hidePorts(n);
      });
      setIsLinking(false);
    };

    newDiagram.toolManager.relinkingTool.doActivate = function() {
      go.RelinkingTool.prototype.doActivate.call(this);
      this.diagram.nodes.each(n => showPorts(n));
    };

    newDiagram.toolManager.relinkingTool.doDeactivate = function() {
      go.RelinkingTool.prototype.doDeactivate.call(this);
      this.diagram.nodes.each(n => {
        if (!n.isSelected) hidePorts(n);
      });
    };

    setDiagram(newDiagram);
    return () => { newDiagram.div = null; };
  }, []);

  useEffect(() => {
    if (!diagram) return;

    const updateRepresentations = () => {
      if (showTextRepresentation) {
        setTextRepresentation(generateTextRepresentation(diagram));
      }
      if (showTurtle) {
        setTurtleRepresentation(generateTurtleRepresentation(diagram));
      }
    };

    diagram.addModelChangedListener(updateRepresentations);
    diagram.addDiagramListener("ChangedSelection", updateRepresentations);
    diagram.addDiagramListener("LinkDrawn", updateRepresentations);
    diagram.addDiagramListener("LinkRelinked", updateRepresentations);

    return () => {
      diagram.removeModelChangedListener(updateRepresentations);
      diagram.removeDiagramListener("ChangedSelection", updateRepresentations);
      diagram.removeDiagramListener("LinkDrawn", updateRepresentations);
      diagram.removeDiagramListener("LinkRelinked", updateRepresentations);
    };
  }, [diagram, showTextRepresentation, showTurtle]);

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
        showTextRepresentation={showTextRepresentation}
        showTurtle={showTurtle}
        toggleTextRepresentation={toggleTextRepresentation}
        toggleTurtle={toggleTurtle}
      />
      <EditorContainer ref={diagramRef} />
      <GridToggle showGrid={showGrid} toggleGrid={toggleGrid} />
      
      {showTextRepresentation && (
        <TextRepresentation>
          {textRepresentation}
        </TextRepresentation>
      )}
      
      {showTurtle && (
        <TextRepresentation>
          {turtleRepresentation}
        </TextRepresentation>
      )}
    </div>
  );
};

export default GraphEditor;
