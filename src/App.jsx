import { useState, useEffect, useRef } from 'react';
import ControlsPanel from './components/ControlsPanel.jsx';
import GraphVisualization from './components/GraphVisualization.jsx';
import { dijkstraStepByStep, reconstructPath } from './utils/dijkstra.js';
import { useSocket, sendMessage as sendMessageFn } from './utils/socket.js';
import {
  nodeRaidus,
  complexGraph,
  simpleGraph,
  complexGraphNodePositions,
  simpleGraphNodePostions,
} from './utils/graphData.js';

function App() {
  const [graphType, setGraphType] = useState('simple');
  const [graphData, setGraphData] = useState(simpleGraph);
  const [nodePositions, setNodePositions] = useState(simpleGraphNodePostions);
  const [startNode, setStartNode] = useState(null);
  const [targetNode, setTargetNode] = useState(null);

  const [dijkstraState, setDijkstraState] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [speed, setSpeed] = useState(500);
  const [finalPath, setFinalPath] = useState([]);

  const [socketStatus, setSocketStatus] = useState('offline');
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const [message, setMessage] = useState('');
  const [messageStatus, setMessageStatus] = useState({ text: 'Idle', type: 'info' });
  const [receivedMessages, setReceivedMessages] = useState([]);

  const dijkstraGeneratorRef = useRef(null);
  const intervalIdRef = useRef(null);

  const socketRef = useSocket(
    graphData,
    setSocketStatus,
    setIsSocketConnected,
    setMessageStatus,
    setReceivedMessages
  );

  useEffect(() => {
    if (graphType === 'simple') {
      setGraphData(simpleGraph);
      setNodePositions(simpleGraphNodePostions);
    } else {
      setGraphData(complexGraph);
      setNodePositions(complexGraphNodePositions);
    }
    setStartNode(null);
    setTargetNode(null);
    reset(false);
  }, [graphType]);

  const startDijkstra = () => {
    if (startNode === null) {
      alert('Please select a start node first.');
      return;
    }
    reset(false);
    dijkstraGeneratorRef.current = dijkstraStepByStep(graphData, startNode);
    setIsRunning(true);
    setIsFinished(false);
    setMessageStatus({ text: 'Dijkstra running...', type: 'info' });
    nextStep();
    startAutoPlay();
  };

  const reset = (resetSelections = true) => {
    stopAutoPlay();
    setIsRunning(false);
    setIsFinished(false);
    setDijkstraState(null);
    dijkstraGeneratorRef.current = null;
    setFinalPath([]);
    if (resetSelections) {
      setStartNode(null);
      setTargetNode(null);
      setMessage('');
    }
    setMessageStatus({ text: 'Idle', type: 'info' });
    setReceivedMessages([]);
  };

  const playPause = () => {
    if (!dijkstraGeneratorRef.current || isFinished) return;
    setIsRunning((prev) => {
      if (!prev) startAutoPlay();
      else stopAutoPlay();
      return !prev;
    });
  };

  const step = () => {
    if (!dijkstraGeneratorRef.current || isRunning || isFinished) return;
    nextStep();
  };

  const handleSpeedChange = (value) => {
    setSpeed(1100 - value);
    if (isRunning) {
      stopAutoPlay();
      startAutoPlay();
    }
  };

  const nextStep = () => {
    if (!dijkstraGeneratorRef.current || isFinished) {
      stopAutoPlay();
      if (dijkstraGeneratorRef.current && !isFinished) {
        setIsFinished(true);
        setIsRunning(false);
        if (startNode !== null && targetNode !== null && dijkstraState?.path) {
          const path = reconstructPath(dijkstraState.path, startNode, targetNode);
          setFinalPath(path);
        } else {
          setFinalPath([]);
        }
      }
      return;
    }

    const result = dijkstraGeneratorRef.current.next();
    if (result.value) setDijkstraState(result.value);

    if (result.done) {
      setIsFinished(true);
      setIsRunning(false);
      stopAutoPlay();
      if (result.value) setDijkstraState(result.value);

      if (startNode !== null && targetNode !== null && result.value?.path) {
        const path = reconstructPath(result.value.path, startNode, targetNode);
        setFinalPath(path);
        if (path.length === 0 && startNode !== targetNode) {
          setMessageStatus({ text: 'Target unreachable', type: 'failed' });
        } else if (path.length > 0) {
          setMessageStatus({ text: 'Path found. Ready to send message.', type: 'info' });
        }
      } else {
        setFinalPath([]);
        setMessageStatus({
          text: targetNode === null ? 'Select target node' : 'Finished',
          type: 'info',
        });
      }
    }
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    if (!isFinished && dijkstraGeneratorRef.current) {
      intervalIdRef.current = setInterval(nextStep, speed);
    }
  };

  const stopAutoPlay = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  const handleNodeClick = (nodeId) => {
    if (isRunning) {
      setMessageStatus({ text: 'Pause or wait to select nodes.', type: 'failed' });
      setTimeout(
        () =>
          setMessageStatus({
            text: dijkstraState ? 'Dijkstra running...' : 'Idle',
            type: 'info',
          }),
        1500
      );
      return;
    }

    if (startNode === null) {
      setStartNode(nodeId);
      if (isFinished) reset(false);
    } else if (targetNode === null && nodeId !== startNode) {
      setTargetNode(nodeId);
      if (isFinished && dijkstraState?.path && startNode !== null) {
        const path = reconstructPath(dijkstraState.path, startNode, nodeId);
        setFinalPath(path);
      }
    } else if (nodeId === startNode || nodeId === targetNode) {
      setTargetNode(null);
      if (isFinished) setFinalPath([]);
    } else {
      setStartNode(nodeId);
      setTargetNode(null);
      if (isFinished || dijkstraState) reset(false);
    }
  };

  const handleSendMessage = () => {
    sendMessageFn(
      socketRef,
      startNode,
      targetNode,
      message,
      finalPath,
      isSocketConnected,
      setMessageStatus,
      setMessage
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold">PathFinder: Dijkstra & Messaging Visualizer</h1>
        <p className="mt-2">Visualize Dijkstra's algorithm and send messages between nodes.</p>
      </header>
      <main className="container mx-auto p-4">
        <ControlsPanel
          startNode={startNode}
          setStartNode={setStartNode}
          targetNode={targetNode}
          setTargetNode={setTargetNode}
          startDijkstra={startDijkstra}
          reset={() => reset(true)}
          playPause={playPause}
          step={step}
          speed={speed}
          handleSpeedChange={handleSpeedChange}
          isRunning={isRunning}
          isFinished={isFinished}
          dijkstraState={dijkstraState}
          finalPath={finalPath}
          message={message}
          setMessage={setMessage}
          sendMessage={handleSendMessage}
          messageStatus={messageStatus}
          socketStatus={socketStatus}
          isSocketConnected={isSocketConnected}
          graphData={graphData}
          setGraphType={setGraphType}
        />
        <GraphVisualization
          graphData={graphData}
          nodePositions={nodePositions}
          nodeRadius={nodeRaidus}
          startNode={startNode}
          targetNode={targetNode}
          dijkstraState={dijkstraState}
          finalPath={finalPath}
          handleNodeClick={handleNodeClick}
          isRunning={isRunning}
          isFinished={isFinished}
          receivedMessages={receivedMessages}
          isSocketConnected={isSocketConnected}
        />
      </main>
    </div>
  );
}

export default App;
