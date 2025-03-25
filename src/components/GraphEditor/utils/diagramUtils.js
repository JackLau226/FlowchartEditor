/**
 * Diagram Utility Functions
 * 
 * A collection of helper functions that support the flow chart editor.
 * These functions handle things like ports, nodes, and diagram representations.
 */

import * as go from 'gojs';
import { buildAST } from './astUtils';

const commonPortProps = {
  figure: "Circle",
  width: 8,
  height: 8,
  fill: "#ffffff",
  stroke: "#000000",
  fromLinkable: true,
  toLinkable: true,
  cursor: "pointer",
  visible: false
};

/**
 * Creates a port template for connecting nodes
 * A port is a point where nodes can be connected together
 */
export const createPortTemplate = (name, alignment, spot, $) => {
  return $(go.Shape, {
    ...commonPortProps,
    alignment,
    alignmentFocus: spot,
    portId: name,
    mouseEnter: (e, port) => {
      if (e.diagram.currentTool instanceof go.LinkingTool ||
          e.diagram.currentTool instanceof go.RelinkingTool) {
        port.stroke = "rgb(100,150,255)";
      }
    },
    mouseLeave: (e, port) => port.stroke = "#000000"
  });
};

/**
 * Shows connection ports on a node
 * @param node - The node to show ports on
 * @param ports - List of port names to show
 */
export const showPorts = (node, ports = ["left", "right", "top", "bottom"]) => {
  ports.forEach(port => {
    const portObj = node.findPort(port);
    if (portObj) portObj.visible = true;
  });
};

/**
 * Hides connection ports on a node
 * @param node - The node to hide ports on
 * @param ports - List of port names to hide
 */
export const hidePorts = (node, ports = ["left", "right", "top", "bottom"]) => {
  ports.forEach(port => {
    const portObj = node.findPort(port);
    if (portObj) portObj.visible = false;
  });
};

/**
 * Gets the initial size for a new node
 * Different shapes have different default sizes
 * @param figure - The type of shape
 */
export const getInitialSize = (figure) => {
  switch (figure) {
    case 'Diamond': return new go.Size(120, 100);
    case 'Rectangle': return new go.Size(120, 60);
    case 'Ellipse': return new go.Size(120, 80);
    default: return new go.Size(60, 60);
  }
};

/**
 * Creates data for a new node
 * @param shape - The type of shape to create
 */
export const createNodeData = (shape) => {
  const timestamp = Date.now();
  const figureMap = {
    'State': 'Ellipse',
    'Decision': 'Diamond',
    'Process': 'Rectangle'
  };
  
  return {
    key: timestamp,
    text: shape,
    figure: figureMap[shape] || shape,
    textColor: '#000000',
    borderColor: '#000000',
    size: getInitialSize(figureMap[shape] || shape),
    stateType: shape === 'State' ? 'normal' : undefined,
    condition: '',
    action: ''
  };
};

export const createLinkData = () => ({
  text: 'transition',
  visible: true,
  branchType: 'true'
});

/**
 * Generates Python code representation of the flowchart
 * @param {go.Diagram} diagram - The diagram to convert
 * @returns {string} Python code representation
 */
export const generatePythonCode = (diagram) => {
  if (!diagram || diagram.nodes.count === 0) return 'No flowchart available';

  const ast = buildAST(diagram);
  if (!ast || ast.length === 0) {
    return 'No valid AST available';
  }

  let result = '# Flowchart Tree Structure\n\n';
  result += 'class Node:\n';
  result += '    def __init__(self, name, node_type, data=None):\n';
  result += '        self.name = name\n';
  result += '        self.type = node_type\n';
  result += '        self.data = data or {}\n';
  result += '        self.children = []\n\n';

  // Create node instances
  ast.forEach(node => {
    const nodeName = node.text.replace(/\s+/g, '_').toLowerCase();
    let nodeData = {};

    if (node.type === 'Process' && node.data.action) {
      nodeData['action'] = node.data.action;
    } else if (node.type === 'Decision' && node.data.condition) {
      nodeData['condition'] = node.data.condition;
    } else if (node.type === 'State' && node.data.stateType) {
      nodeData['state_type'] = node.data.stateType;
    }

    result += `${nodeName} = Node('${node.text}', '${node.type}', ${JSON.stringify(nodeData)})\n`;
  });

  result += '\n# Build tree structure\n';
  
  // Add child relationships
  ast.forEach(node => {
    const nodeName = node.text.replace(/\s+/g, '_').toLowerCase();
    node.children.forEach(child => {
      const childName = child.node.text.replace(/\s+/g, '_').toLowerCase();
      if (node.type === 'Decision') {
        result += `${nodeName}.children.append(('${child.branchType}', ${childName}))\n`;
      } else {
        result += `${nodeName}.children.append(${childName})\n`;
      }
    });
  });

  return result;
};


