export const exampleFlowcharts = {
  'process-flow': {
    nodes: [
      { key: 1, text: 'Start', figure: 'Ellipse', stateType: 'start', loc: '0 0' },
      { key: 2, text: 'Process 1', figure: 'Rectangle', loc: '0 100' },
      { key: 3, text: 'Process 2', figure: 'Rectangle', loc: '0 200' },
      { key: 4, text: 'Process 3', figure: 'Rectangle', loc: '0 300' },
      { key: 5, text: 'End', figure: 'Ellipse', stateType: 'end', loc: '0 400' }
    ],
    links: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 }
    ]
  },
  'decision-tree': {
    nodes: [
      { key: 1, text: 'Start', figure: 'Ellipse', stateType: 'start', loc: '0 0' },
      { key: 2, text: 'Decision 1', figure: 'Diamond', loc: '0 100' },
      { key: 3, text: 'Process A', figure: 'Rectangle', loc: '-150 200' },
      { key: 4, text: 'Process B', figure: 'Rectangle', loc: '150 200' },
      { key: 5, text: 'End', figure: 'Ellipse', stateType: 'end', loc: '0 300' }
    ],
    links: [
      { from: 1, to: 2 },
      { from: 2, to: 3, branchType: 'true' },
      { from: 2, to: 4, branchType: 'false' },
      { from: 3, to: 5 },
      { from: 4, to: 5 }
    ]
  },
  'simple-loop': {
    nodes: [
      { key: 1, text: 'Start', figure: 'Ellipse', stateType: 'start', loc: '0 0' },
      { key: 2, text: 'Process', figure: 'Rectangle', loc: '0 100' },
      { key: 3, text: 'Decision', figure: 'Diamond', loc: '0 200' },
      { key: 4, text: 'End', figure: 'Ellipse', stateType: 'end', loc: '200 200' }
    ],
    links: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 2, branchType: 'true' },
      { from: 3, to: 4, branchType: 'false' }
    ]
  }
}; 