import * as go from 'gojs';
import { createPortTemplate, getInitialSize } from '../utils/diagramUtils';

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
          editable: true
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
