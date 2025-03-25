/**
 * Node Template Configuration
 * 
 * Defines how nodes (shapes) look and behave in the diagram.
 * This includes their appearance, size, and interaction behavior.
 */

import * as go from 'gojs';
import { createPortTemplate, getInitialSize } from '../utils/diagramUtils';

/**
 * Creates a template for diagram nodes
 * Handles the visual style and behavior of nodes
 */
export const createNodeTemplate = ($, setSelectedNode, setNodeColors) => {
  return $(go.Node, "Spot",
    {
      locationSpot: go.Spot.Center,
      selectionAdorned: true,
      selectionObjectName: "PANEL",
      resizable: true,
      resizeObjectName: "SHAPE"
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Panel, "Auto",
      {
        name: "PANEL",
        portId: "",
      },
      $(go.Shape,
        {
          name: "SHAPE",
          fill: "#ffffff",
          stroke: "#000000",
          strokeWidth: 2,
          cursor: "move",
          minSize: new go.Size(40, 40)
        },
        new go.Binding("figure", "figure"),
        new go.Binding("stroke", "borderColor"),
        new go.Binding("strokeWidth", "stateType", type => {
          if (type === 'start') return 4;
          if (type === 'end') return 4;
          return 2;
        }),
        new go.Binding("stroke", "stateType", type => {
          if (type === 'start') return '#4CAF50';
          if (type === 'end') return '#F44336';
          return '#000000';
        }),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding("desiredSize", "figure", fig => {
          if (fig && !fig.size) {
            return getInitialSize(fig);
          }
          return undefined;
        })
      ),
      $(go.TextBlock,
        {
          margin: 8,
          font: "bold 14px sans-serif",
          editable: true,
          textEdited: (tb, oldText, newText) => {
            const node = tb.part;
            if (!node) return;
            
            // Update the text first
            node.diagram.model.setDataProperty(node.data, "text", newText);
            
            // Then check if it's a valid action/condition
            updateNodeActionFromText(node, node.diagram);
          }
        },
        new go.Binding("text").makeTwoWay(),
        new go.Binding("stroke", "textColor")
      )
    ),
    createPortTemplate("left", go.Spot.Left, go.Spot.Right, $),
    createPortTemplate("right", go.Spot.Right, go.Spot.Left, $),
    createPortTemplate("top", go.Spot.Top, go.Spot.Bottom, $),
    createPortTemplate("bottom", go.Spot.Bottom, go.Spot.Top, $)
  );
};

// Function to validate action syntax
export const isValidActionSyntax = (text, isDecisionNode = false) => {
  if (isDecisionNode) {
    // Regex for decision node comparisons
    const decisionRegex = /^([a-zA-Z_][a-zA-Z0-9]*)\s*(==|!=|>|<|>=|<=)\s*([0-9]+|true|false|[a-zA-Z_][a-zA-Z0-9]*)$/;
    return decisionRegex.test(text);
  } else {
    // Regex for process node actions
    const processRegex = /^([a-zA-Z_][a-zA-Z0-9]*)\s*=\s*([0-9]+|[a-zA-Z_][a-zA-Z0-9]*)$|^([a-zA-Z_][a-zA-Z0-9]*)\s*=\s*([0-9]+|[a-zA-Z_][a-zA-Z0-9]*)$|^([a-zA-Z_][a-zA-Z0-9]*)\s*([+\-*\/])\s*([0-9]+|[a-zA-Z_][a-zA-Z0-9]*)$/;
    return processRegex.test(text);
  }
};

// Function to update node action or condition from text
export const updateNodeActionFromText = (node, diagram) => {
  const newText = node.data.text;
  const isDecisionNode = node.data.figure === 'Diamond'; // Check if it's a decision node

  if (isDecisionNode) {
    // If it's a decision node, check the condition syntax
    if (isValidActionSyntax(newText, true)) { // Pass true for decision node
      diagram.model.setDataProperty(node.data, "condition", newText);
      diagram.model.setDataProperty(node.data, "action", ''); // Clear action for decision nodes
    } else {
      diagram.model.setDataProperty(node.data, "condition", ''); // Clear condition if invalid
    }
  } else {
    // If it's a process node, check the action syntax
    if (isValidActionSyntax(newText, false)) { // Pass false for process node
      diagram.model.setDataProperty(node.data, "action", newText);
      diagram.model.setDataProperty(node.data, "condition", ''); // Clear condition for process nodes
    } else {
      diagram.model.setDataProperty(node.data, "action", ''); // Clear action if invalid
    }
  }
};
