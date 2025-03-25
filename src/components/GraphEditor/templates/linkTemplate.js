/**
 * Link Template Configuration
 * 
 * Defines how connections between nodes look and behave.
 * Handles the visual style and interaction of connecting lines.
 */

import * as go from 'gojs';

const commonShapeProps = {
  isPanelMain: true,
  stroke: "#000000",
  strokeWidth: 2
};

/**
 * Creates a template for diagram links
 * Controls how lines connecting nodes appear and behave
 */
export const createLinkTemplate = ($, setSelectedLink) => {
  return $(go.Link, {
    routing: go.Link.Normal,
    curve: go.Link.None,
    corner: 5,
    toShortLength: 4,
    relinkableFrom: false,
    relinkableTo: false,
    reshapable: true,
    resegmentable: true,
    selectable: true,
    mouseEnter: (e, link) => {
      if (link.fromNode && link.toNode) {
        link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
      }
    },
    mouseLeave: (e, link) => link.findObject("HIGHLIGHT").stroke = "transparent",
    selectionChanged: (part) => {
      if (part.isSelected && part.fromNode && part.toNode) {
        if (part.fromNode.data.figure === 'Diamond' && !part.data.branchType) {
          part.diagram.model.setDataProperty(part.data, "branchType", "true");
        }
        setSelectedLink(part);
      } else if (!part.diagram.selection.count) {
        setSelectedLink(null);
      }
    }
  },
  new go.Binding("points").makeTwoWay(),
  new go.Binding("branchType").makeTwoWay(),
  $(go.Shape, { ...commonShapeProps },
    new go.Binding("stroke", "color"),
    new go.Binding("strokeDashArray", "dash")
  ),
  $(go.Shape, { ...commonShapeProps, stroke: "transparent", strokeWidth: 8, name: "HIGHLIGHT" }),
  $(go.Shape, { toArrow: "standard", stroke: null },
    new go.Binding("fill", "color")
  ),
  $(go.Panel, "Auto", {
    visible: false,
    name: "LABEL",
    segmentIndex: 2
  },
  new go.Binding("visible", "visible"),
  $(go.Shape, "RoundedRectangle", { fill: "#F8F8F8", stroke: null }),
  $(go.TextBlock, "transition", {
    textAlign: "center",
    font: "10pt helvetica, arial, sans-serif",
    stroke: "#333333",
    margin: 4
  },
  new go.Binding("text", "text").makeTwoWay())));
};
