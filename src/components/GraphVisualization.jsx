import Edge from './Edge.jsx';
import MessagePopup from './MessagePopup.jsx';
import Node from './Node.jsx';

function GraphVisualization({
  graphData,
  nodePositions,
  nodeRadius,
  startNode,
  targetNode,
  dijkstraState,
  finalPath,
  handleNodeClick,
  isRunning,
  isFinished,
  receivedMessages,
  isSocketConnected,
}) {
  if (!graphData || !graphData.nodes || !graphData.edges) {
    console.error('Invalid graphData:', graphData);
    return <div>Error: Invalid graph data</div>;
  }
  if (!nodePositions || Object.keys(nodePositions).length === 0) {
    console.error('Invalid nodePositions:', nodePositions);
    return <div>Error: Invalid node positions</div>;
  }

  const padding = nodeRadius * 2;
  const xCoords = Object.values(nodePositions).map((pos) => pos.x);
  const yCoords = Object.values(nodePositions).map((pos) => pos.y);
  const minX = Math.min(...xCoords) - padding;
  const maxX = Math.max(...xCoords) + padding;
  const minY = Math.min(...yCoords) - padding;
  const maxY = Math.max(...yCoords) + padding;
  const width = maxX - minX;
  const height = maxY - minY;
  const viewBox = `${minX} ${minY} ${width} ${height}`;

  const getOverlayContent = () => {
    if (!isSocketConnected) {
      return <div className="overlay-message">Socket disconnected. Please check the server.</div>;
    }
    if (isRunning) {
      return <div className="overlay-message">Dijkstra algorithm running...</div>;
    }
    return null;
  };

  // Log receivedMessages to debug popup rendering
  //console.log('GraphVisualization receivedMessages:', receivedMessages);

  return (
    <div className="graph-container relative">
      <svg
        id="graph-svg"
        width="100%"
        height="600px"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Graph visualization of nodes and edges"
      >
        <g id="edges-group">
          {graphData.edges.map((edge, index) => (
            <Edge
              key={`edge-${index}`}
              edge={edge}
              nodePositions={nodePositions}
              dijkstraState={dijkstraState || {}}
              finalPath={finalPath || []}
            />
          ))}
        </g>
        <g id="nodes-group">
          {graphData.nodes.map((node) => (
            <Node
              key={`node-${node.id}`}
              node={node}
              position={nodePositions[node.id] || { x: 0, y: 0 }}
              nodeRadius={nodeRadius}
              startNode={startNode}
              targetNode={targetNode}
              dijkstraState={dijkstraState || {}}
              finalPath={finalPath || []}
              handleNodeClick={handleNodeClick}
              isFinished={isFinished}
            />
          ))}
        </g>
        <g id="messages-group">
          {receivedMessages.map((msg) => {
            if (!nodePositions[msg.nodeId]) {
              console.warn(`Invalid nodeId ${msg.nodeId} for message:`, msg);
              return null;
            }
            console.log('Rendering MessagePopup:', { nodeId: msg.nodeId, message: msg.message, position: nodePositions[msg.nodeId] });
            return (
              <MessagePopup
                key={`msg-${msg.id}`}
                nodeId={msg.nodeId}
                message={msg.message}
                position={nodePositions[msg.nodeId]}
                nodeRadius={nodeRadius}
              />
            );
          })}
        </g>
      </svg>
      <div className="overlay">{getOverlayContent()}</div>
    </div>
  );
}

export default GraphVisualization;