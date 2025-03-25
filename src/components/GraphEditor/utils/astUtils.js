/**
 * AST (Abstract Syntax Tree) Utilities
 * 
 * This file contains all AST-related functionality for the flowchart editor:
 * - AST node representation and manipulation
 * - AST generation and validation
 * - AST analysis (depth, complexity, etc.)
 * - Code generation from AST
 */

/**
 * Represents a node in the Abstract Syntax Tree
 */
class ASTNode {
  constructor(id, type, text, data = {}) {
    this.id = id;
    this.type = type;         // 'State' | 'Process' | 'Decision'
    this.text = text;
    this.data = data;
    this.children = [];       // Outgoing connections
    this.parents = [];        // Incoming connections
  }

  addChild(node, branchType = null) {
    this.children.push({ node, branchType });
  }

  addParent(node) {
    this.parents.push(node);
  }
}

/**
 * Gets the type of a node
 * @param {go.Node} node - The node to check
 * @returns {string} The type of the node ('Decision', 'State', or 'Process')
 */
const getNodeType = (node) => {
  if (!node || !node.data || !node.data.figure) return 'Unknown';
  return node.data.figure === 'Diamond' ? 'Decision' :
         node.data.figure === 'Ellipse' ? 'State' : 'Process';
};

/**
 * Converts a GoJS diagram to an Abstract Syntax Tree
 * @param {go.Diagram} diagram - The GoJS diagram to convert
 * @returns {Array<ASTNode>} Array of AST nodes
 */
export const buildAST = (diagram) => {
  const nodes = new Map();

  // First pass: Create AST nodes
  diagram.nodes.each(node => {
    if (!node || !node.data || !node.data.figure) return;

    const type = getNodeType(node);
    const astNode = new ASTNode(
      node.key,
      type,
      node.data.text || 'Unnamed',
      {
        action: node.data.action,
        condition: node.data.condition,
        stateType: node.data.stateType
      }
    );
    nodes.set(node.key, astNode);
  });

  // Second pass: Build connections
  diagram.links.each(link => {
    if (!link || !link.fromNode || !link.toNode) return;

    const fromNode = nodes.get(link.fromNode.key);
    const toNode = nodes.get(link.toNode.key);
    
    if (fromNode && toNode) {
      fromNode.addChild(toNode, link.data?.branchType);
      toNode.addParent(fromNode);
    }
  });

  return Array.from(nodes.values());
};

/**
 * Validates a specific node's connections using AST
 * @param {ASTNode} node - The AST node to validate
 * @returns {Object} Validation results for the specific node
 */
export const validateASTNode = (node) => {
  const errors = [];

  if (node.type === 'Decision') {
    if (node.children.length !== 2) {
      errors.push(`Decision node must have exactly two outgoing links (currently has ${node.children.length}).`);
    }

    const hasTrueBranch = node.children.some(child => child.branchType === 'true');
    const hasFalseBranch = node.children.some(child => child.branchType === 'false');

    if (node.children.length === 2 && (!hasTrueBranch || !hasFalseBranch)) {
      errors.push('Decision node must have both true and false branches.');
    }
  } else {
    if (node.children.length > 1) {
      errors.push(`${node.type} node can only have one outgoing link (currently has ${node.children.length}).`);
    }
  }

  if (node.children.length === 0 && node.parents.length === 0) {
    errors.push('Node is not connected to any other node.');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Checks if a link is valid according to the rules
 * @param {go.Link} link - The link to validate
 * @returns {Object} Validation results for the specific link
 */
export const validateLink = (link) => {
  const errors = [];

  // Skip validation if link or its nodes are not properly initialized
  if (!link || !link.fromNode || !link.toNode || !link.data) {
    return {
      isValid: true,
      errors: []
    };
  }

  if (link.fromNode.data?.figure === 'Diamond') {
    if (!link.data.branchType) {
      errors.push('Link from decision node must specify a branch type (true/false).');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Helper function to get node details for AST representation
const getNodeDetails = (node) => {
  let details = `Type: ${node.type}`;
  if (node.type === 'State' && node.data.stateType) {
    details += `, StateType: ${node.data.stateType}`;
  } else if (node.type === 'Process' && node.data.action) {
    details += `, Action: ${node.data.action}`;
  } else if (node.type === 'Decision' && node.data.condition) {
    details += `, Condition: ${node.data.condition}`;
  }
  return details;
};

// Helper function to format connections
const getConnectionDetails = (node) => {
  if (node.children.length === 0) return 'No outgoing connections';
  
  return node.children.map(child => {
    const branchInfo = child.branchType ? ` (${child.branchType} branch)` : '';
    return `→ ${child.node.text}${branchInfo}`;
  }).join('\n      ');
};

// Helper function to calculate maximum depth of the AST
const calculateMaxDepth = (ast) => {
  const startNode = ast.find(node => 
    node.type === 'State' && 
    node.data.stateType === 'start'
  );
  
  if (!startNode) return 0;

  const visited = new Set();
  
  const dfs = (node) => {
    if (visited.has(node.id)) return 0;
    if (node.children.length === 0) return 1;
    
    visited.add(node.id);
    const childDepths = node.children.map(child => dfs(child.node));
    visited.delete(node.id);
    
    return 1 + Math.max(...childDepths);
  };

  return dfs(startNode);
};

// Helper function to calculate average branching factor
const calculateBranchingFactor = (ast) => {
  if (ast.length === 0) return 0;
  
  const totalBranches = ast.reduce((sum, node) => sum + node.children.length, 0);
  return totalBranches / ast.length;
};

// Helper function to calculate cyclomatic complexity
const calculateCyclomaticComplexity = (ast) => {
  // Cyclomatic complexity = E - N + 2P
  // where E = number of edges, N = number of nodes, P = number of connected components (usually 1)
  const edges = ast.reduce((sum, node) => sum + node.children.length, 0);
  const nodes = ast.length;
  const P = 1; // Assuming a single connected component
  
  return edges - nodes + (2 * P);
};

/**
 * Creates an AST representation of the diagram
 * @param {go.Diagram} diagram - The diagram to convert
 * @returns {string} Formatted AST representation
 */
export const generateASTRepresentation = (diagram) => {
  if (!diagram || diagram.nodes.count === 0) return 'No AST available';

  const ast = buildAST(diagram);
  if (!ast) return 'No AST available';

  let result = 'Abstract Syntax Tree:\n\n';

  // Calculate statistics
  const stats = {
    totalNodes: ast.length,
    decisionNodes: ast.filter(node => node.type === 'Decision').length,
    maxDepth: calculateMaxDepth(ast),
    branchingFactor: calculateBranchingFactor(ast),
    cyclomaticComplexity: calculateCyclomaticComplexity(ast)
  };

  // Add statistics section
  result += 'Analysis Statistics:\n';
  result += `• Total Nodes: ${stats.totalNodes}\n`;
  result += `• Decision Nodes: ${stats.decisionNodes}\n`;
  result += `• Maximum Depth: ${stats.maxDepth}\n`;
  result += `• Average Branching Factor: ${stats.branchingFactor.toFixed(2)}\n`;
  result += `• Cyclomatic Complexity: ${stats.cyclomaticComplexity}\n\n`;
  result += 'AST Structure:\n';

  // Generate AST text representation
  ast.forEach((node, index) => {
    result += `Node ${index + 1}: ${node.text}\n`;
    result += `  ${getNodeDetails(node)}\n`;
    result += `  Connections:\n    ${getConnectionDetails(node)}\n\n`;
  });

  return result;
}; 