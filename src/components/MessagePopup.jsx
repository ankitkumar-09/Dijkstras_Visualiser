import { useEffect, useState } from 'react';

function MessagePopup({ nodeId, message, position, nodeRadius }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('MessagePopup useEffect:', { nodeId, message, position });
    if (message && position) {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, position]);

 


  return (
    <g
      className={`message-popup ${visible ? 'visible' : ''}`}
            transform={`translate(${position?.x || 0}, ${position?.y || 0})`}
      style={{ display: visible ? 'block' : 'none' }}
      aria-label={`Message at node ${nodeId}: ${message}`}
    >
      <rect
        x={200}
        y={200}
        width={75}
        height={40}
        rx="4"
        className="message-popup-rect"
        fill="#fff"
        stroke="#000"
      />
      <text
        x="0"
        y="7"
        className="message-popup-text"
        textAnchor="middle"
      
        fontSize="12"
      >
        {message}
      </text>
    </g>
  );
}

export default MessagePopup;