import * as go from 'gojs';
import { showPorts, hidePorts } from './diagramUtils';
import { isValidActionSyntax } from '../templates/nodeTemplate';

export const handleSelectionChanged = (e, diagram, setSelectedNode, setNodeColors, setSelectedLink, setCurrentLineStyle) => {
  const node = e.diagram.selection.first();
  if (node instanceof go.Node) {
    setSelectedNode(node);
    setNodeColors({
      text: node.data.textColor || '#000000',
      border: node.data.borderColor || '#000000'
    });

    // Update action/condition if needed
    if (diagram && (node.data.figure === 'Rectangle' || node.data.figure === 'Diamond')) {
      const text = node.data.text;
      diagram.model.setDataProperty(
        node.data,
        node.data.figure === 'Rectangle' ? "action" : "condition",
        isValidActionSyntax(text, node.data.figure === 'Diamond') ? text : ''
      );
    }

    // Show ports only on selected node
    e.diagram.nodes.each(n => {
      if (n === node) showPorts(n);
      else hidePorts(n);
    });
  } else {
    const link = e.diagram.selection.first();
    if (link instanceof go.Link) {
      setSelectedLink(link);
      setCurrentLineStyle(link.data?.routing || 'straight');
    } else {
      setSelectedNode(null);
      setSelectedLink(null);
    }
  }
};

export const handleLinkingToolActivation = (diagram, setIsLinking) => {
  diagram.toolManager.linkingTool.doActivate = function() {
    go.LinkingTool.prototype.doActivate.call(this);
    this.diagram.nodes.each(n => showPorts(n));
    setIsLinking(true);
  };

  diagram.toolManager.linkingTool.doDeactivate = function() {
    go.LinkingTool.prototype.doDeactivate.call(this);
    this.diagram.nodes.each(n => {
      if (!n.isSelected) hidePorts(n);
    });
    setIsLinking(false);
  };
};

export const handleRelinkingToolActivation = (diagram) => {
  diagram.toolManager.relinkingTool.doActivate = function() {
    go.RelinkingTool.prototype.doActivate.call(this);
    this.diagram.nodes.each(n => showPorts(n));
  };

  diagram.toolManager.relinkingTool.doDeactivate = function() {
    go.RelinkingTool.prototype.doDeactivate.call(this);
    this.diagram.nodes.each(n => {
      if (!n.isSelected) hidePorts(n);
    });
  };
}; 