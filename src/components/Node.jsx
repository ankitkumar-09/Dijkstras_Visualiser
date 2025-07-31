function Node({ node, position, nodeRadius, startNode, targetNode, dijkstraState, finalPath, handleNodeClick, isFinished }) {
  // Initialize variables
  let isSender = false;
  let isReceiver = false;
  let isVisited = false;
  let isCurrent = false;
  let isUpdating = false;
  let isPathNode = false;
  let className = 'node-circle';
  let distanceText = '';
  let dist;

  // Check if node is sender
  if (node.id == startNode) {
    isSender = true;
  }

  // Check if node is receiver
  if (node.id == targetNode) {
    isReceiver = true;
  }

  // Check if node is visited
  if (dijkstraState && dijkstraState.visited) {
    if (dijkstraState.visited.has(node.id)) {
      isVisited = true;
    }
  }

  // Check if node is current
  if (dijkstraState && dijkstraState.currentNode == node.id) {
    isCurrent = true;
  }

  // Check if node is being updated
  if (dijkstraState && dijkstraState.phase == 'updating' && dijkstraState.updatedNode == node.id) {
    isUpdating = true;
  }

  // Check if node is in final path
  if (Array.isArray(finalPath)) {
    for (let i = 0; i < finalPath.length; i++) {
      if (finalPath[i] == node.id) {
        isPathNode = true;
        break;
      }
    }
  }

  // Build className string
  if (isSender || isReceiver) {
    className += ' selected';
  }
  if (isPathNode && !isSender && !isReceiver) {
    className += ' path';
  }
  if (isCurrent) {
    className += ' current';
  } else if (isVisited && !isPathNode && !isSender && !isReceiver) {
    className += ' visited';
  }
  if (isUpdating) {
    className += ' updating';
  }
  if (isSender && isFinished) {
    className += ' messaging-sender';
  }
  if (isReceiver && isFinished) {
    className += ' messaging-receiver';
  }

  // Calculate distance text
  if (dijkstraState && dijkstraState.distances) {
    dist = dijkstraState.distances[node.id];
  }
  if (node.id == startNode) {
    if (dist == undefined || dist == Infinity) {
      dist = 0;
    }
  }
  if (dist == Infinity) {
    distanceText = '∞';
  } else if (dist != undefined) {
    distanceText = dist.toString();
  } else {
    distanceText = '';
  }

  // Build aria-label
  let ariaLabel = 'Node N' + node.id;
  if (distanceText) {
    ariaLabel += ', Distance: ' + distanceText;
  } else {
    ariaLabel += ', Distance: N/A';
  }
  if (isSender) {
    ariaLabel += ', Sender';
  } else if (isReceiver) {
    ariaLabel += ', Receiver';
  }

  return (
    <g
      className="node-group"
      transform={'translate(' + position.x + ',' + position.y + ')'}
      tabIndex="0"
      role="button"
      aria-label={ariaLabel}
      onClick={function() { handleNodeClick(node.id); }}
      onKeyDown={function(e) {
        if (e.key == 'Enter' || e.key == ' ') {
          e.preventDefault();
          handleNodeClick(node.id);
        }
      }}
    >
      <circle
        cx="0"
        cy="0"
        r={nodeRadius + 4}
        className="node-selection-ring"
        style={{ display: (isSender || isReceiver) ? 'block' : 'none' }}
      />
      <circle cx="0" cy="0" r={nodeRadius} className={className} />
      <text x="0" y={-nodeRadius - 10} className="node-label" textAnchor="middle">{'N' + node.id}</text>
      <text x="0" y="0" className="node-distance" textAnchor="middle" dominantBaseline="middle">{distanceText}</text>
    </g>
  );
}

export default Node;