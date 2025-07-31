import PriorityQueue from './priorityQueue.js';

export function* dijkstraStepByStep(graph, startNodeId) {
  const distances = {};
  const path = {};
  const visited = new Set();
  const pq = new PriorityQueue();

  for (const node of graph.nodes) {
    distances[node.id] = Infinity;
    path[node.id] = null;
  }
  distances[startNodeId] = 0;
  pq.enqueue(startNodeId, 0);

  yield {
    phase: 'init',
    distances: {...distances},
    visited: new Set(visited),
    path: {...path},
    queue: pq.getNodes(),
    exploringEdge: null
  };

  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    if (!current || visited.has(current.nodeId)) continue;

    const currentNodeId = current.nodeId;
    visited.add(currentNodeId);

    yield {
      phase: 'visiting',
      currentNode: currentNodeId,
      distances: {...distances},
      visited: new Set(visited),
      path: {...path},
      queue: pq.getNodes(),
      exploringEdge: null
    };

    const neighbors = graph.edges.filter(edge => 
      edge.from === currentNodeId || edge.to === currentNodeId
    );

    for (const edge of neighbors) {
      const neighborId = edge.from === currentNodeId ? edge.to : edge.from;
      if (visited.has(neighborId)) continue;

      // Yield before updating
      yield {
        phase: 'updating',
        currentNode: currentNodeId,
        distances: {...distances},
        visited: new Set(visited),
        path: {...path},
        queue: pq.getNodes(),
        exploringEdge: edge
      };

      const newDist = distances[currentNodeId] + edge.weight;

      if (newDist < distances[neighborId]) {
        distances[neighborId] = newDist;
        path[neighborId] = currentNodeId;

        if (pq.has(neighborId)) {
          pq.decreasePriority(neighborId, newDist);
        } else {
          pq.enqueue(neighborId, newDist);
        }

        // Yield after updating
        yield {
          phase: 'updating',
          updatedNode: neighborId,
          currentNode: currentNodeId,
          distances: {...distances},
          visited: new Set(visited),
          path: {...path},
          queue: pq.getNodes(),
          exploringEdge: edge
        };
      }
    }
  }

  // Final state
  const finalState = {
    phase: 'done',
    currentNode: null,
    distances: {...distances},
    visited: new Set(visited),
    path: {...path},
    queue: [],
    exploringEdge: null
  };
  
  yield finalState;
  return finalState;
}

export function reconstructPath(pathData, start, end) {
  const path = [];
  let current = end;
  const visited = new Set();

  if (current == null) return [];
  if (start === end) return [start];

  while (current != null) {
    if (visited.has(current)) return [];
    visited.add(current);
    path.unshift(current);
    if (current === start) break;
    current = pathData[current];
  }

  return path[0] === start ? path : [];
}