import * as go from 'gojs';

export const createLinkTemplate = ($) => {
  return $(go.Link,
    {
      routing: go.Link.Normal,
      curve: go.Link.None,
      corner: 5,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true,
      selectionAdorned: true
    },
    new go.Binding("routing", "routing", (v) => v === "jump" ? go.Link.AvoidsNodes : go.Link.Normal),
    new go.Binding("curve", "routing", (v) => v === "jump" ? go.Link.JumpOver : go.Link.None),
    $(go.Shape, { strokeWidth: 2, stroke: "#999" }),
    $(go.Shape, { toArrow: "Standard", stroke: "#999" })
  );
};
