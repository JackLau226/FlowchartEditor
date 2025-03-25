import { validateFlowchart } from '../utils/flowchartValidation';
import { buildAST, validateASTNode, validateLink } from '../utils/astUtils';

describe('Flowchart Validation Tests', () => {
  test('Empty flowchart should be valid', () => {
    const emptyDiagram = {
      nodes: { count: 0, each: jest.fn() },
      links: { count: 0, each: jest.fn() }
    };
    
    const result = validateFlowchart(emptyDiagram);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('Single node flowchart should be valid', () => {
    const singleNodeDiagram = {
      nodes: {
        count: 1,
        each: (callback) => {
          callback({
            data: { key: 1, text: 'Start', figure: 'Ellipse', stateType: 'start' },
            key: 1
          });
        }
      },
      links: { count: 0, each: jest.fn() }
    };

    const result = validateFlowchart(singleNodeDiagram);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('Unconnected nodes should be invalid', () => {
    const unconnectedNodesDiagram = {
      nodes: {
        count: 2,
        each: (callback) => {
          callback({
            data: { key: 1, text: 'Node1', figure: 'Rectangle' },
            key: 1
          });
          callback({
            data: { key: 2, text: 'Node2', figure: 'Rectangle' },
            key: 2
          });
        }
      },
      links: { count: 0, each: jest.fn() }
    };

    const result = validateFlowchart(unconnectedNodesDiagram);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Node is not connected to any other node.');
  });

  test('Valid connected flowchart should pass validation', () => {
    const connectedDiagram = {
      nodes: {
        count: 2,
        each: (callback) => {
          callback({
            data: { key: 1, text: 'Start', figure: 'Ellipse', stateType: 'start' },
            key: 1
          });
          callback({
            data: { key: 2, text: 'End', figure: 'Ellipse', stateType: 'end' },
            key: 2
          });
        }
      },
      links: {
        count: 1,
        each: (callback) => {
          callback({
            data: { from: 1, to: 2 },
            fromNode: { data: { key: 1, text: 'Start' }, key: 1 },
            toNode: { data: { key: 2, text: 'End' }, key: 2 }
          });
        }
      }
    };

    const result = validateFlowchart(connectedDiagram);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('Decision node should have two outgoing links', () => {
    const decisionNodeDiagram = {
      nodes: {
        count: 3,
        each: (callback) => {
          callback({
            data: { key: 1, text: 'Decision', figure: 'Diamond' },
            key: 1
          });
          callback({
            data: { key: 2, text: 'Target1', figure: 'Rectangle' },
            key: 2
          });
          callback({
            data: { key: 3, text: 'Target2', figure: 'Rectangle' },
            key: 3
          });
        }
      },
      links: {
        count: 1,
        each: (callback) => {
          callback({
            data: { from: 1, to: 2, branchType: 'true' },
            fromNode: { data: { key: 1, text: 'Decision' }, key: 1 },
            toNode: { data: { key: 2, text: 'Target1' }, key: 2 }
          });
        }
      }
    };

    const result = validateFlowchart(decisionNodeDiagram);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Decision node must have exactly two outgoing links (currently has 1).');
  });
}); 