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
      setMessageStatus({ text: `Connection failed: ${err.message}`, type: 'failed' });
    });

    socketRef.current.on('disconnect', () => {
      setIsSocketConnected(false);
      setSocketStatus('disconnected');
    });

    socketRef.current.on('receive_message', ({ nodeId, message }) => {
      const isValidNode = graphData.nodes.some((node) => node.id === nodeId);
      if (!isValidNode) return;

      setReceivedMessages([{ nodeId, message, id: Date.now() }]);

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

export function sendMessage(
  socketRef,
  startNode,
  targetNode,
  message,
  finalPath,
  isSocketConnected,
  setMessageStatus,
  setMessage
) {
  if (!isSocketConnected || !socketRef.current) {
    setMessageStatus({ text: 'Not connected to server.', type: 'failed' });
    return;
  }

  if (!startNode || !targetNode || !message || !finalPath.length) {
    setMessageStatus({
      text: 'Cannot send message. Missing required fields.',
      type: 'failed',
    });
    return;
  }

  const payload = {
    senderId: startNode,
    receiverId: targetNode,
    message,
    path: finalPath,
  };

  setMessageStatus({ text: 'Sending message...', type: 'sending' });

  socketRef.current.emit('send_message', payload, (ack) => {
    if (ack.success) {
      setMessageStatus({ text: 'Message sent to server.', type: 'delivered' });
      setMessage('');
    } else {
      setMessageStatus({
        text: `Failed to send: ${ack.error || 'Unknown server error'}`,
        type: 'failed',
      });
    }
  });
}
