import { simulateFlowchart, generateSimulationText } from '../utils/simulationLogic';
import { buildAST } from '../utils/astUtils';

describe('Simulation Logic Tests', () => {
  test('Simple process flow simulation', () => {
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

    const result = simulateFlowchart(diagram, {});
    expect(result.completed).toBe(true);
    expect(result.variables).toEqual({ x: 1 });
    expect(result.path).toHaveLength(3);
  });

  test('Decision node with true condition', () => {
    const diagram = {
      nodes: {
        count: 5,
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
          callback({
            data: { key: 5, text: 'End', figure: 'Ellipse', stateType: 'end' },
            key: 5
          });
        }
      },
      links: {
        count: 5,
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
          callback({
            data: { from: 3, to: 5 },
            fromNode: { data: { key: 3, text: 'True Path' }, key: 3 },
            toNode: { data: { key: 5, text: 'End' }, key: 5 }
          });
          callback({
            data: { from: 4, to: 5 },
            fromNode: { data: { key: 4, text: 'False Path' }, key: 4 },
            toNode: { data: { key: 5, text: 'End' }, key: 5 }
          });
        }
      }
    };

    const result = simulateFlowchart(diagram, { x: 1 });
    expect(result.completed).toBe(true);
    expect(result.path[2].text).toBe('True Path'); // Should take true branch
  });

  test('Simulation text generation', () => {
    const path = [
      { text: 'Start', type: 'State', data: { stateType: 'start' } },
      { text: 'Process', type: 'Process', data: { action: 'x = 1' } },
      { text: 'End', type: 'State', data: { stateType: 'end' } }
    ];

    const variables = { x: 1 };
    const completed = true;
    const error = null;

    const text = generateSimulationText(path, completed, variables, error);
    expect(text).toContain('Start');
    expect(text).toContain('Process');
    expect(text).toContain('End');
    expect(text).toContain('x = 1');
    expect(text).toContain('Execution Path:');
    expect(text).toContain('Variable Values After Simulation:');
  });

  test('Simulation with error', () => {
    const path = [
      { text: 'Start', type: 'State', data: { stateType: 'start' } },
      { text: 'Process', type: 'Process', data: { action: 'x = y + 1' } }
    ];

    const variables = {};
    const completed = false;
    const error = 'Variable y is not defined';

    const text = generateSimulationText(path, completed, variables, error);
    expect(text).toContain('Error:');
    expect(text).toContain('Variable y is not defined');
  });
}); 