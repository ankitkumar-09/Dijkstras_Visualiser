import { useState } from 'react';

function ControlsPanel({
  startNode, setStartNode,
  targetNode, setTargetNode,
  startDijkstra,
  isFinished, finalPath,
  message, setMessage, sendMessage,
  isSocketConnected,
  graphData, setGraphType,
  graphType
}) {
  const canSendMessage = (
    isFinished &&
    startNode !== null &&
    targetNode !== null &&
    finalPath.length > 0 &&
    isSocketConnected
  );

  return (
    <div className="controls-panel">
      <h2>Path Controls</h2>

      <div className="control-group">
        <label>Graph Type:</label>
        <select
          value={graphType}
          onChange={(e) => setGraphType(e.target.value)}
          className="graph-select"
        >
          <option value="simple">Simple Graph</option>
          <option value="complex">Complex Graph</option>
        </select>
      </div>

      <div className="control-group">
        <label>Start Node (Sender):</label>
        <select
          value={startNode || ''}
          onChange={(e) => setStartNode(Number(e.target.value))}
        >
          <option value="" disabled>Select Sender</option>
          {graphData.nodes.map(node => (
            <option key={node.id} value={node.id}>{node.label}</option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label>Target Node (Receiver):</label>
        <select
          value={targetNode || ''}
          onChange={(e) => setTargetNode(Number(e.target.value))}
          disabled={!startNode}
        >
          <option value="" disabled>Select Receiver</option>
          {graphData.nodes
            .filter(node => node.id !== startNode)
            .map(node => (
              <option key={node.id} value={node.id}>{node.label}</option>
            ))}
        </select>
      </div>

      <button 
        onClick={startDijkstra} 
        disabled={!startNode}
        className="btn-primary"
      >
        Find Shortest Path
      </button>

      {isFinished && (
        <div className="messaging-section">
          <h3>Send Message</h3>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="message-input"
          />
          <button
            onClick={sendMessage}
            disabled={!canSendMessage}
            className="btn-send"
          >
            Send Message
          </button>
        </div>
      )}
    </div>
  );
}

export default ControlsPanel;