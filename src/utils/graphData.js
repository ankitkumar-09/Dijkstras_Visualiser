const nodeRaidus = 22;

// Complex Graph
const complexGraph = {
  nodes: Array.from({ length: 10 }, (_, i) => ({ id: i, label: `N${i}` })), //creating 10 nodes...
  //default edges...
  edges: [
    { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 2 },
    { from: 1, to: 3, weight: 5 }, { from: 4, to: 0, weight: 10 },
    { from: 2, to: 5, weight: 3 }, { from: 3, to: 4, weight: 4 },
    { from: 3, to: 6, weight: 6 }, { from: 4, to: 7, weight: 8 },
    { from: 5, to: 3, weight: 1 }, { from: 5, to: 8, weight: 5 },
    { from: 6, to: 7, weight: 2 }, { from: 7, to: 9, weight: 6 },
    { from: 7, to: 0, weight: 7 }, { from: 8, to: 6, weight: 2 },
    { from: 9, to: 0, weight: 8 }, { from: 4, to: 2, weight: 1 },
    { from: 7, to: 5, weight: 3 }, { from: 8, to: 0, weight: 3 },
    { from: 6, to: 5, weight: 3 }, { from: 4, to: 5, weight: 3 },
    { from: 3, to: 2, weight: 3 }, { from: 2, to: 1, weight: 3 },
  ],
};

// Simple Graph
const simpleGraph = {
  nodes: Array.from({ length: 5 }, (_, i) => ({ id: i, label: `N${i}` })),
  edges: [
    { from: 0, to: 1, weight: 6 },
    { from: 1, to: 2, weight: 11 },
    { from: 2, to: 3, weight: 2 },
    { from: 3, to: 0, weight: 4 },
    { from: 4, to: 0, weight: 3 },
    { from: 4, to: 1, weight: 3 },
    { from: 4, to: 3, weight: 5 },
    { from: 3, to: 1, weight: 7 },
  ],
};

// setting SVG elements positions in 2D-palne
const complexGraphNodePositions = {
  0: { x: 300, y: 50 }, 1: { x: 476, y: 138 }, 2: { x: 550, y: 300 },
  3: { x: 476, y: 462 }, 4: { x: 300, y: 550 }, 5: { x: 124, y: 462 },
  6: { x: 50, y: 300 }, 7: { x: 124, y: 138 }, 8: { x: 200, y: 200 },
  9: { x: 400, y: 400 },
};

const simpleGraphNodePostions = {
  0: { x: 300, y: 200 }, 1: { x: 500, y: 200 }, 2: { x: 600, y: 300 },
  3: { x: 500, y: 400 }, 4: { x: 300, y: 400 },
};

export { nodeRaidus, complexGraph, simpleGraph, complexGraphNodePositions, simpleGraphNodePostions };