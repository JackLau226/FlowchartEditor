import { generateASTRepresentation } from '../utils/astUtils';

describe('AST Generation Tests', () => {
  test('Empty diagram AST generation', () => {
    const diagram = {
      nodes: { count: 0, each: jest.fn() },
      links: { count: 0, each: jest.fn() }
    };

    const ast = generateASTRepresentation(diagram);
    expect(ast).toContain('No AST available');
  });

  test('Simple flowchart AST generation', () => {
    const diagram = {
      nodes: {
        count: 3,
        each: (callback) => {
          callback({
            data: { key: 1, text: 'Start', figure: 'Ellipse', stateType: 'start' },
            key: 1
          });
          callback({
            data: { key: 2, text: 'Process', figure: 'Rectangle', action: 'x = 1' },
            key: 2
          });
          callback({
            data: { key: 3, text: 'End', figure: 'Ellipse', stateType: 'end' },
            key: 3
          });
        }
      },
      links: {
        count: 2,
        each: (callback) => {
          callback({
            data: { from: 1, to: 2 },
            fromNode: { data: { key: 1, text: 'Start' }, key: 1 },
            toNode: { data: { key: 2, text: 'Process' }, key: 2 }
          });
          callback({
            data: { from: 2, to: 3 },
            fromNode: { data: { key: 2, text: 'Process' }, key: 2 },
            toNode: { data: { key: 3, text: 'End' }, key: 3 }
          });
        }
      }
    };

    const ast = generateASTRepresentation(diagram);
    
    // Check statistics
    expect(ast).toContain('Total Nodes: 3');
    expect(ast).toContain('Decision Nodes: 0');
    expect(ast).toContain('Maximum Depth: 3');
    
    // Check node content
    expect(ast).toContain('Start');
    expect(ast).toContain('Process');
    expect(ast).toContain('End');
    expect(ast).toContain('x = 1');
  });

  test('Decision tree AST generation', () => {
    const diagram = {
      nodes: {
        count: 4,
        each: (callback) => {
          callback({
            data: { key: 1, text: 'Start', figure: 'Ellipse', stateType: 'start' },
            key: 1
          });
          callback({
            data: { key: 2, text: 'Decision', figure: 'Diamond', condition: 'x > 0' },
            key: 2
          });
          callback({
            data: { key: 3, text: 'True Path', figure: 'Rectangle' },
            key: 3
          });
          callback({
            data: { key: 4, text: 'False Path', figure: 'Rectangle' },
            key: 4
          });
        }
      },
      links: {
        count: 3,
        each: (callback) => {
          callback({
            data: { from: 1, to: 2 },
            fromNode: { data: { key: 1, text: 'Start' }, key: 1 },
            toNode: { data: { key: 2, text: 'Decision' }, key: 2 }
          });
          callback({
            data: { from: 2, to: 3, branchType: 'true' },
            fromNode: { data: { key: 2, text: 'Decision' }, key: 2 },
            toNode: { data: { key: 3, text: 'True Path' }, key: 3 }
          });
          callback({
            data: { from: 2, to: 4, branchType: 'false' },
            fromNode: { data: { key: 2, text: 'Decision' }, key: 2 },
            toNode: { data: { key: 4, text: 'False Path' }, key: 4 }
          });
        }
      }
    };

    const ast = generateASTRepresentation(diagram);
    
    // Check statistics
    expect(ast).toContain('Total Nodes: 4');
    expect(ast).toContain('Decision Nodes: 1');
    expect(ast).toContain('Maximum Depth: 3');
    
    // Check decision node content
    expect(ast).toContain('x > 0');
    expect(ast).toContain('true branch');
    expect(ast).toContain('false branch');
  });

  test('Complex flowchart AST generation', () => {
    const diagram = {
      nodes: {
        count: 5,
        each: (callback) => {
          callback({
            data: { key: 1, text: 'Start', figure: 'Ellipse', stateType: 'start' },
            key: 1
          });
          callback({
            data: { key: 2, text: 'Process 1', figure: 'Rectangle', action: 'x = 1' },
            key: 2
          });
          callback({
            data: { key: 3, text: 'Decision', figure: 'Diamond', condition: 'x > 0' },
            key: 3
          });
          callback({
            data: { key: 4, text: 'Process 2', figure: 'Rectangle', action: 'y = x + 1' },
            key: 4
          });
          callback({
            data: { key: 5, text: 'End', figure: 'Ellipse', stateType: 'end' },
            key: 5
          });
        }
      },
      links: {
        count: 4,
        each: (callback) => {
          callback({
            data: { from: 1, to: 2 },
            fromNode: { data: { key: 1, text: 'Start' }, key: 1 },
            toNode: { data: { key: 2, text: 'Process 1' }, key: 2 }
          });
          callback({
            data: { from: 2, to: 3 },
            fromNode: { data: { key: 2, text: 'Process 1' }, key: 2 },
            toNode: { data: { key: 3, text: 'Decision' }, key: 3 }
          });
          callback({
            data: { from: 3, to: 4, branchType: 'true' },
            fromNode: { data: { key: 3, text: 'Decision' }, key: 3 },
            toNode: { data: { key: 4, text: 'Process 2' }, key: 4 }
          });
          callback({
            data: { from: 4, to: 5 },
            fromNode: { data: { key: 4, text: 'Process 2' }, key: 4 },
            toNode: { data: { key: 5, text: 'End' }, key: 5 }
          });
        }
      }
    };

    const ast = generateASTRepresentation(diagram);
    
    // Check statistics
    expect(ast).toContain('Total Nodes: 5');
    expect(ast).toContain('Decision Nodes: 1');
    expect(ast).toContain('Maximum Depth: 5');
    
    // Check content and structure
    expect(ast).toContain('Process 1');
    expect(ast).toContain('x = 1');
    expect(ast).toContain('x > 0');
    expect(ast).toContain('Process 2');
    expect(ast).toContain('y = x + 1');
  });
}); 