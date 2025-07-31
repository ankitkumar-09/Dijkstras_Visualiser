import Edge from './Edge';
import MessagePopup from './MessagePopup';
import Node from './Node';

function GraphVisualization({
  graphData,
  nodePositions,
  nodeRadius,
  startNode,
  targetNode,
  dijkstraState = {},
  finalPath = [],
  handleNodeClick,
  isRunning,
  isFinished,
  receivedMessages = [],
  isSocketConnected,
}) {
  const padding = nodeRadius * 2;
  const allPositions = Object.values(nodePositions);
  const viewBox = [
    Math.min(...allPositions.map(p => p.x)) - padding,
    Math.min(...allPositions.map(p => p.y)) - padding,
    Math.max(...allPositions.map(p => p.x)) - Math.min(...allPositions.map(p => p.x)) + padding * 2,
    Math.max(...allPositions.map(p => p.y)) - Math.min(...allPositions.map(p => p.y)) + padding * 2
  ].join(' ');

  return (
    <div className="graph-container">
      <svg
        width="100%"
        height="600px"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        aria-label="Graph visualization"
      >
        {/* Edges */}
        {graphData.edges.map(edge => (
          <Edge
            key={`${edge.from}-${edge.to}`}
            edge={edge}
            nodePositions={nodePositions}
            dijkstraState={dijkstraState}
            finalPath={finalPath}
          />
        ))}

        {/* Nodes */}
        {graphData.nodes.map(node => (
          <Node
            key={node.id}
            node={node}
            position={nodePositions[node.id] || { x: 0, y: 0 }}
            nodeRadius={nodeRadius}
            startNode={startNode}
            targetNode={targetNode}
            dijkstraState={dijkstraState}
            finalPath={finalPath}
            handleNodeClick={handleNodeClick}
            isFinished={isFinished}
          />
        ))}

        {/* Messages */}
        {receivedMessages
          .filter(msg => nodePositions[msg.nodeId])
          .map(msg => (
            <MessagePopup
              key={msg.id}
              nodeId={msg.nodeId}
              message={msg.message}
              position={nodePositions[msg.nodeId]}
              nodeRadius={nodeRadius}
            />
          ))
        }
      </svg>

      {/* Status overlay */}
      {!isSocketConnected && (
        <div className="overlay">Socket disconnected. Please check the server.</div>
      )}
      {isRunning && (
        <div className="overlay">Dijkstra algorithm running...</div>
      )}
    </div>
  );
}

export default GraphVisualization;