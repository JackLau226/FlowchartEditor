/**
 * Flowchart Validation Rules
 * 
 * This file contains validation functions for checking flowchart constraints:
 * 1. Every node can have many incoming links
 * 2. State and Process nodes can only have one outgoing link
 * 3. Decision nodes must have exactly two outgoing links
 * 4. Every node must be connected (no isolated nodes)
 */

import { buildAST, validateASTNode, validateLink } from './astUtils';

/**
 * Validates the entire flowchart according to all rules
 * @param {go.Diagram} diagram - The GoJS diagram to validate
 * @returns {Object} Validation results with errors if any
 */
export const validateFlowchart = (diagram) => {
  const errors = [];
  const ast = buildAST(diagram);

  // Empty diagram is now valid
  if (ast.length === 0) {
    return {
      isValid: true,
      errors: [],
      ast: ast
    };
  }

  // Single node is now valid
  if (ast.length === 1) {
    return {
      isValid: true,
      errors: [],
      ast: ast
    };
  }

  // Validate each node in the AST
  ast.forEach(node => {
    // Only validate connections if there are multiple nodes
    if (ast.length > 1) {
      const nodeValidation = validateASTNode(node);
      if (!nodeValidation.isValid) {
        errors.push(...nodeValidation.errors);
      }
    }
  });

  // Validate links
  diagram.links.each(link => {
    const linkValidation = validateLink(link);
    if (!linkValidation.isValid) {
      errors.push(...linkValidation.errors);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors,
    ast: ast
  };
};