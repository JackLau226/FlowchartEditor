import * as go from 'gojs';

export const createPortTemplate = (name, alignment, spot, $) => {
  return $(go.Shape, {
    figure: "Circle",
    width: 8,
    height: 8,
    fill: "#ffffff",
    stroke: "#000000",
    alignment: alignment,
    alignmentFocus: spot,
    portId: name,
    fromLinkable: true,
    toLinkable: true,
    cursor: "pointer",
    visible: false,
    mouseEnter: (e, port) => {
      if (e.diagram.currentTool instanceof go.LinkingTool ||
          e.diagram.currentTool instanceof go.RelinkingTool) {
        port.stroke = "rgb(100,150,255)";
      }
    },
    mouseLeave: (e, port) => {
      port.stroke = "#000000";
    }
  });
};

export const showPorts = (node, ports = ["left", "right", "top", "bottom"]) => {
  ports.forEach(port => {
    const portObj = node.findPort(port);
    if (portObj) portObj.visible = true;
  });
};

export const hidePorts = (node, ports = ["left", "right", "top", "bottom"]) => {
  ports.forEach(port => {
    const portObj = node.findPort(port);
    if (portObj) portObj.visible = false;
  });
};

export const getInitialSize = (figure) => {
  switch(figure) {
    case "Diamond": return new go.Size(120, 80);
    case "Rectangle": return new go.Size(120, 60);
    case "Ellipse": return new go.Size(120, 75);
    default: return new go.Size(80, 40);
  }
};

export const createNodeData = (shape) => {
  const timestamp = Date.now();
  let figure = shape;
  
  if (shape === 'State') figure = 'Ellipse';
  else if (shape === 'Decision') figure = 'Diamond';
  else if (shape === 'Process') figure = 'Rectangle';
  
  return {
    key: timestamp,
    text: shape,
    figure: figure,
    textColor: '#000000',
    borderColor: '#000000',
    size: getInitialSize(figure)
  };
};

export const generateTextRepresentation = (diagram) => {
  if (!diagram) return '';

  let result = 'Graph Structure:\n';
  result += diagram.nodes.count === 0 ? '*None*\n\n' : '';
  
  diagram.nodes.each(node => {
    if (!node || !node.data) return;
    result += `• ${node.data.text} (${node.data.figure === 'Ellipse' ? 'State' : 
              node.data.figure === 'Diamond' ? 'Decision' : 'Process'})\n`;
  });

  result += '\nConnections:\n';
  result += diagram.links.count === 0 ? '*None*\n' : '';
  
  diagram.links.each(link => {
    if (!link || !link.data) return;
    const from = link.fromNode.data.text;
    const to = link.toNode.data.text;
    if (from && to) {
      result += `• ${from} -> ${to}\n`;
    }
  });

  return result;
};

export const generateTurtleRepresentation = (diagram) => {
  if (!diagram) return '';

  let result = '@prefix flow: <http://example.org/flowchart#> .\n\n';
  const nodes = new Map();

  // First pass: collect all nodes
  diagram.nodes.each(node => {
    if (!node || !node.data) return;
    const nodeType = node.data.figure === 'Ellipse' ? 'State' : 
                    node.data.figure === 'Diamond' ? 'Decision' : 'Process';
    const nodeId = `flow:${nodeType}_${node.key}`;
    nodes.set(node.key, {
      id: nodeId,
      type: nodeType,
      label: node.data.text,
      outgoingLinks: []
    });
  });

  // Second pass: collect all links
  diagram.links.each(link => {
    if (!link || !link.fromNode || !link.toNode) return;
    const fromNode = nodes.get(link.fromNode.key);
    const toNode = nodes.get(link.toNode.key);
    if (fromNode && toNode) {
      fromNode.outgoingLinks.push(toNode.id);
    }
  });

  // Generate turtle representation
  nodes.forEach(node => {
    result += `${node.id} a flow:${node.type} ;\n`;
    result += `    flow:label "${node.label}"`;
    
    if (node.outgoingLinks.length > 0) {
      result += ` ;\n    flow:next ${node.outgoingLinks.join(', ')} `;
    }
    
    result += '.\n\n';
  });

  return result;
};
