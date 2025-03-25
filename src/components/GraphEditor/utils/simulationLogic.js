/**
 * Flowchart Simulation Logic
 * 
 * This file contains the logic for simulating the execution of a flowchart.
 * The simulation starts from a start state and follows the path through the flowchart,
 * logging each node it passes through.
 */

import { buildAST } from './astUtils';
import { validateFlowchart } from './flowchartValidation';

/**
 * Evaluates a process action and updates variables
 * @param {string} action - The action to evaluate (already validated by nodeTemplate.js)
 * @param {Object} variables - Current variable values
 * @returns {Object} Updated variables
 */
const evaluateAction = (action, variables) => {
  if (!action) return variables;

  // Handle assignment (e.g., x = 1 or x = y)
  if (action.includes('=')) {
    const [varName, value] = action.split('=').map(part => part.trim());
    const newValue = isNaN(value) ? variables[value] : parseInt(value, 10);
    if (newValue !== undefined) {
      return { ...variables, [varName]: newValue };
    }
    return variables;
  }

  // Handle operation (e.g., x + 1 or x + y)
  const parts = action.split(/\s*([\+\-\*\/])\s*/);
  if (parts.length === 3) {
    const [varName, operator, value] = parts;
    const currentValue = variables[varName];
    const operandValue = isNaN(value) ? variables[value] : parseInt(value, 10);

    if (currentValue !== undefined && operandValue !== undefined) {
      let result;
      switch (operator) {
        case '+': result = currentValue + operandValue; break;
        case '-': result = currentValue - operandValue; break;
        case '*': result = currentValue * operandValue; break;
        case '/': result = currentValue / operandValue; break;
        default: return variables;
      }
      return { ...variables, [varName]: result };
    }
  }

  return variables;
};

/**
 * Evaluates a decision condition
 * @param {string} condition - The condition to evaluate
 * @param {Object} variables - Current variable values
 * @returns {Object} Result of condition evaluation with status and error if any
 */
const evaluateCondition = (condition, variables) => {
  // Check if condition exists
  if (!condition) {
    return {
      status: 'error',
      error: 'Decision node has no condition',
      result: null
    };
  }

  // Parse condition into variable, operator, and value
  const parts = condition.split(/\s*(==|!=|>|<|>=|<=)\s*/);
  if (parts.length !== 3) {
    return {
      status: 'error',
      error: `Invalid condition format: ${condition}`,
      result: null
    };
  }

  const [varName, operator, value] = parts;

  // Check if variable exists
  if (!(varName in variables)) {
    return {
      status: 'error',
      error: `Variable "${varName}" is not defined`,
      result: null
    };
  }

  // Get the variable value
  const leftValue = variables[varName];

  // Parse the right-hand value
  let rightValue;
  if (value === 'true') rightValue = true;
  else if (value === 'false') rightValue = false;
  else if (!isNaN(value)) rightValue = parseInt(value, 10);
  else if (value in variables) rightValue = variables[value];
  else {
    return {
      status: 'error',
      error: `Invalid or undefined value in condition: ${value}`,
      result: null
    };
  }

  // Evaluate the condition
  let result;
  switch (operator) {
    case '==': result = leftValue === rightValue; break;
    case '!=': result = leftValue !== rightValue; break;
    case '>': result = leftValue > rightValue; break;
    case '<': result = leftValue < rightValue; break;
    case '>=': result = leftValue >= rightValue; break;
    case '<=': result = leftValue <= rightValue; break;
    default:
      return {
        status: 'error',
        error: `Invalid operator: ${operator}`,
        result: null
      };
  }

  return {
    status: 'success',
    error: null,
    result: result
  };
};

/**
 * Finds the start state in the flowchart
 * @param {Array<ASTNode>} ast - The abstract syntax tree of the flowchart
 * @returns {Object} Object containing the start node and any validation errors
 */
const findStartState = (ast) => {
  const startStates = ast.filter(node => 
    node.type === 'State' && 
    node.data.stateType === 'start'
  );

  if (startStates.length === 0) {
    return { 
      startNode: null, 
      error: 'No start state found in the flowchart.' 
    };
  }

  if (startStates.length > 1) {
    return { 
      startNode: null, 
      error: 'Multiple start states found. The flowchart must have exactly one start state.' 
    };
  }

  return { startNode: startStates[0], error: null };
};

/**
 * Simulates the execution of the flowchart
 * @param {go.Diagram} diagram - The GoJS diagram to simulate
 * @param {Object} initialVariables - Initial variable values
 * @returns {Object} Simulation results including path and any errors
 */
export const simulateFlowchart = (diagram, initialVariables = {}) => {
  // First validate the flowchart
  const { ast, isValid, errors } = validateFlowchart(diagram);
  if (!isValid) {
    return {
      isValid: false,
      path: [],
      error: 'Cannot simulate invalid flowchart. Please fix validation errors first.',
      variables: initialVariables
    };
  }

  // Find the start state
  const { startNode, error: startError } = findStartState(ast);
  if (startError) {
    return {
      isValid: false,
      path: [],
      error: startError,
      variables: initialVariables
    };
  }

  // Initialize simulation state
  const path = [];
  const visited = new Set();
  const visitedDecisionPaths = new Set(); // Track visited decision paths
  let currentNode = startNode;
  let variables = { ...initialVariables };
  let reachedEnd = false;

  // Simulate until we can't continue or hit an end state
  while (currentNode) {
    // Check for loops
    if (visited.has(currentNode.id)) {
      return {
        path,
        error: 'Loop detected. Loops are not supported in simulation.',
        variables
      };
    }

    // Add current node to path and mark as visited
    path.push({
      id: currentNode.id,
      text: currentNode.text,
      type: currentNode.type,
      data: currentNode.data
    });
    visited.add(currentNode.id);

    // If we hit an end state, stop simulation
    if (currentNode.type === 'State' && currentNode.data.stateType === 'end') {
      reachedEnd = true;
      break;
    }

    // Handle different node types
    if (currentNode.type === 'Process') {
      // Execute the process action
      variables = evaluateAction(currentNode.data.action, variables);
      currentNode = currentNode.children[0]?.node || null;
    } else if (currentNode.type === 'Decision') {
      // Evaluate the condition
      const evaluation = evaluateCondition(currentNode.data.condition, variables);
      
      // If there was an error evaluating the condition, stop simulation
      if (evaluation.status === 'error') {
        return {
          isValid: false,
          path,
          error: `Error at decision node "${currentNode.text}": ${evaluation.error}`,
          variables
        };
      }

      // Get true and false branches
      const trueBranches = currentNode.children.filter(child => child.branchType === 'true');
      const falseBranches = currentNode.children.filter(child => child.branchType === 'false');

      // Validate branch count
      if (trueBranches.length !== 1 || falseBranches.length !== 1) {
        return {
          isValid: false,
          path,
          error: `Decision node "${currentNode.text}" must have exactly one true branch and one false branch`,
          variables
        };
      }

      // Create unique path identifiers
      const truePath = `${currentNode.id}-true`;
      const falsePath = `${currentNode.id}-false`;

      // Check if we've already visited the true path
      if (evaluation.result && visitedDecisionPaths.has(truePath)) {
        return {
          isValid: false,
          path,
          error: `Cannot traverse the same true branch twice at decision node "${currentNode.text}"`,
          variables
        };
      }

      // Take the appropriate branch based on condition result
      if (evaluation.result) {
        visitedDecisionPaths.add(truePath);
        currentNode = trueBranches[0].node;
      } else {
        currentNode = falseBranches[0].node;
      }
    } else {
      // For other nodes, just take the first child
      currentNode = currentNode.children[0]?.node || null;
    }

  }

  return {
    isValid: true,
    completed: reachedEnd,
    path,
    error: null,
    variables
  };
};

/**
 * Generates a text representation of the simulation path
 * @param {Array} path - Array of nodes in the simulation path
 * @param {boolean} completed - Whether simulation reached an end state
 * @param {Object} variables - Final variable values
 * @param {string} error - Error message if simulation failed
 * @returns {string} Formatted text representation of the path
 */
export const generateSimulationText = (path, completed, variables, error) => {
  if (!path || path.length === 0) return 'No simulation path available.';

  let result = '';
  
  // Add error message at the start if exists
  if (error) {
    result += `Error: ${error}\n\n`;
  }

  result += 'Execution Path:\n';
  
  result += path.map((node, index) => {
    let text = `${index + 1}. ${node.text} (${node.type})`;
    if (node.type === 'State' && node.data.stateType) {
      text += ` [${node.data.stateType}]`;
    } else if (node.type === 'Process' && node.data.action) {
      text += ` - Action: ${node.data.action}`;
    } else if (node.type === 'Decision' && node.data.condition) {
      text += ` - Condition: ${node.data.condition}`;
    }
    return text;
  }).join('\n');

  // Add variable values section
  result += '\n\nVariable Values After Simulation:\n';
  if (Object.keys(variables).length === 0) {
    result += 'No variables defined';
  } else {
    result += Object.entries(variables)
      .map(([name, value]) => `${name} = ${value}`)
      .join('\n');
  }

  return result;
}; 