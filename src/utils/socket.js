import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export function useSocket(
  graphData,
  setSocketStatus,
  setIsSocketConnected,
  setMessageStatus,
  setReceivedMessages
) {
  const socketRef = useRef(null); 

  useEffect(() => {
    const SOCKET_SERVER_URL = 'http://localhost:3001'; 

    setSocketStatus('connecting');

    socketRef.current = io(SOCKET_SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000, 
    });

    socketRef.current.on('connect', () => {
      setIsSocketConnected(true);
      setSocketStatus('connected');
    });

    socketRef.current.on('connect_error', (err) => {
      setIsSocketConnected(false);
      setSocketStatus('error');
      setMessageStatus({
        text: `Connection failed: ${err.message}`,
        type: 'failed',
      });
    });

    socketRef.current.on('disconnect', () => {
      setIsSocketConnected(false);
      setSocketStatus('disconnected');
    });

    socketRef.current.on('receive_message', ({ nodeId, message }) => {
      const isValidNode = graphData.nodes.some((node) => node.id === nodeId);
      if (!isValidNode) {
        console.warn(`Invalid nodeId: ${nodeId}`);
        return;
      }

      setReceivedMessages([
        { nodeId, message, id: Date.now() },
      ]);

      setMessageStatus({
        text: `Message received at Node ${nodeId}: ${message}`,
        type: 'delivered',
      });
    });

    socketRef.current.on('error', (error) => {
      setMessageStatus({
        text: `Socket error: ${error.message || 'Unknown error'}`,
        type: 'failed',
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [
    graphData.nodes,
    setSocketStatus,
    setIsSocketConnected,
    setMessageStatus,
    setReceivedMessages,
  ]);

  return socketRef;
}
