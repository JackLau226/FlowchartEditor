import * as go from 'gojs';

export const createDiagramConfig = (diagramRef) => {
  const $ = go.GraphObject.make;
  return $(go.Diagram, diagramRef, {
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
}; 