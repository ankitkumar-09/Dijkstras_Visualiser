import { useState, useEffect, useRef } from 'react';
import ControlsPanel from './components/ControlsPanel.jsx';
import GraphVisualization from './components/GraphVisualization.jsx';
import { dijkstraStepByStep, reconstructPath } from './utils/dijkstra.js';
import { useSocket, sendMessage } from './utils/socket.js';

import {nodeRaidus,complexGraph,simpleGraph,complexGraphNodePositions,simpleGraphNodePostions} from './utils/graphData.js';

function App() {
  //graph intilization setup...
  const [graphType, setGraphType] = useState('simple'); // choose graph which have to visualize...default is simple
  const [graphData, setGraphData] = useState(simpleGraph);
  const [nodePositions, setNodePositions] = useState(simpleGraphNodePostions);
  const [startNode, setStartNode] = useState(null);//choose source node
  const [targetNode, setTargetNode] = useState(null);//choose destination node

  const [dijkstraState, setDijkstraState] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [speed, setSpeed] = useState(500);//visualization speed
  
  const [finalPath, setFinalPath] = useState([]);//store the final path to highlight at last...

  const [socketStatus, setSocketStatus] = useState('offline');//connectivity with socket...

  const [isSocketConnected, setIsSocketConnected] = useState(false);//intitally socket is not connected to send the message...

  const [message, setMessage] = useState('');

  const [messageStatus, setMessageStatus] = useState({ text: 'Idle', type: 'info' });//???

  const [receivedMessages, setReceivedMessages] = useState([]);
  
  const dijkstraGeneratorRef = useRef(null);//??

  const intervalIdRef = useRef(null);//??

  // Log receivedMessages changes
  useEffect(() => {
   // console.log('App.jsx receivedMessages updated:', receivedMessages);
  }, [receivedMessages]);

  // Socket.IO Hook    ///????
  const socketRef = useSocket(
    graphData,
    setSocketStatus,
    setIsSocketConnected,
    setMessageStatus,
    setReceivedMessages
  );

  //render the page when graph type is changed from simple to complex or vice versa...
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
    reset(false);///???
  }, [graphType]);//on change of graph type

  // on click buttotn start algorrthim...DAA
  const startDijkstra = () => {
    if (startNode === null) {
      alert('Please select a start node first.');
      return;
    }
    reset(false);///??what this will do
    dijkstraGeneratorRef.current = dijkstraStepByStep(graphData, startNode); //update dijkstra  genrator with return value of function
    setIsRunning(true);
    setIsFinished(false);
    setMessageStatus({ text: 'Dijkstra running...', type: 'info' });
    nextStep();
    startAutoPlay();
  };
//reset button... rnder page to reset all the data...
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
//play pause to button to stop algortihm at some moment...
  const playPause = () => {
    if (!dijkstraGeneratorRef.current || isFinished) return;
    setIsRunning((prev) => {
      if (!prev) {
        startAutoPlay();
      } else {
        stopAutoPlay();
      }
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
          console.log('Setting finalPath after Dijkstra complete:', path);
          setFinalPath(path);
        } else {
          setFinalPath([]);
        }
      }
      return;
    }

    const result = dijkstraGeneratorRef.current.next();
    if (result.value) {
      setDijkstraState(result.value);
    }

    if (result.done) {
      setIsFinished(true);
      setIsRunning(false);
      stopAutoPlay();
      if (result.value) setDijkstraState(result.value);
      if (startNode !== null && targetNode !== null && result.value?.path) {
        const path = reconstructPath(result.value.path, startNode, targetNode);
        console.log('Setting finalPath when done:', path);
        setFinalPath(path);
        if (path.length === 0 && startNode !== targetNode) {
          setMessageStatus({ text: 'Target unreachable', type: 'failed' });
        } else if (path.length > 0) {
          setMessageStatus({ text: 'Path found. Ready to send message.', type: 'info' });
        }
      } else {
        setFinalPath([]);
        setMessageStatus({ text: targetNode === null ? 'Select target node' : 'Finished', type: 'info' });
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
    console.log('handleNodeClick:', { nodeId, startNode, targetNode, isRunning, isFinished });
    if (isRunning) {
      setMessageStatus({ text: 'Pause or wait to select nodes.', type: 'failed' });
      setTimeout(() => setMessageStatus({ text: dijkstraState ? 'Dijkstra running...' : 'Idle', type: 'info' }), 1500);
      return;
    }

    if (startNode === null) {
      setStartNode(nodeId);
      if (isFinished) reset(false);
    } else if (targetNode === null && nodeId !== startNode) {
      setTargetNode(nodeId);
      if (isFinished && dijkstraState?.path && startNode !== null) {
        const path = reconstructPath(dijkstraState.path, startNode, nodeId);
        console.log('Setting finalPath on target node select:', path);
        setFinalPath(path);
      }
    } else if (nodeId === startNode) {
      setTargetNode(null);
      if (isFinished && targetNode !== null) {
        setFinalPath([]);
      }
    } else if (nodeId === targetNode) {
      setTargetNode(null);
      if (isFinished) {
        setFinalPath([]);
      }
    } else {
      setStartNode(nodeId);
      setTargetNode(null);
      if (isFinished || dijkstraState) reset(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold">PathFinder: Dijkstra & Messaging Visualizer</h1>
        <p className="mt-2">Visualize Dijkstra's algorithm and send messages between nodes.</p>
      </header>
      <main className="container mx-auto p-4">
        <ControlsPanel
          // passing props for controls panel...
          startNode={startNode}
          setStartNode={setStartNode}
          targetNode={targetNode}
          setTargetNode={setTargetNode}
          startDijkstra={startDijkstra}//???button
          reset={() => reset(true)}//???button
          playPause={playPause}//button
          step={step}//manual visualize button
          speed={speed}
          handleSpeedChange={handleSpeedChange}
          isRunning={isRunning}
          isFinished={isFinished}
          dijkstraState={dijkstraState}
          finalPath={finalPath} //store the path
          message={message}
          setMessage={setMessage}
          //socket concept check it out later...
          sendMessage={() =>
            sendMessage(socketRef, startNode, targetNode, message, finalPath, isSocketConnected, setMessageStatus, setMessage)
          }
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