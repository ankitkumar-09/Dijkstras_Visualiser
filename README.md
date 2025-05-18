
# PathFinder: Interactive Graph Visualization for Efficient Pathfinding

This project is an interactive visualizer for Dijkstra's algorithm, built with React and Vite. It allows users to visualize the shortest path between nodes in a graph and simulate message passing between nodes using a real-time Socket.IO server.

---

## Table of Contents

- [Features](#features)
- [Frontend Part: How This Visualizer Works](#frontend-part-how-this-visualizer-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Socket Server](#socket-server)
- [Customization](#customization)
- [License](#license)

---

## Features

- **Interactive Graph Visualization:** Choose between simple and complex graphs.
- **Dijkstra's Algorithm Animation:** Step-by-step or auto-play visualization of the shortest path algorithm.
- **Node Selection:** Select start (sender) and target (receiver) nodes via dropdown or by clicking on the graph.
- **Message Passing:** Send a message from the sender to the receiver along the computed shortest path, visualized in real-time.
- **Socket.IO Integration:** Real-time communication with a backend server to simulate message delivery.
- **Responsive UI:** Modern, accessible, and responsive user interface.

---

## Frontend Part: How This Visualizer Works

The frontend is implemented in React and provides a seamless, interactive experience for visualizing Dijkstra's algorithm and simulating message passing.

### 1. **Graph Selection and Initialization**

- Users can select between a "Simple" or "Complex" graph using a dropdown in the controls panel.
- The graph structure (nodes and edges) and their positions are defined in [`src/utils/graphData.js`](src/utils/graphData.js).
- When the graph type changes, the visualization resets and updates to reflect the new graph.

### 2. **Node Selection**

- Users select the **Start Node (Sender)** and **Target Node (Receiver)** either by clicking on nodes in the graph or using dropdowns.
- The UI ensures that the sender and receiver are not the same and disables invalid selections.

### 3. **Running Dijkstra's Algorithm**

- Pressing "Start Dijkstra" begins the step-by-step execution of Dijkstra's algorithm.
- The algorithm is implemented as a generator in [`src/utils/dijkstra.js`](src/utils/dijkstra.js), allowing for fine-grained control over each step.
- Users can:
  - **Play/Pause** the animation to watch the algorithm in action.
  - **Step** through the algorithm manually.
  - **Adjust Animation Speed** with a slider.
  - **Reset** the visualization at any time.

### 4. **Visualization Details**

- **Nodes** and **Edges** are rendered as SVG elements in [`src/components/GraphVisualization.jsx`](src/components/GraphVisualization.jsx).
- The current node, visited nodes, and the shortest path are visually distinguished with different colors and styles.
- Edge weights are displayed, and the currently explored edge is highlighted during updates.

### 5. **Result and Messaging**

- Once the algorithm finishes, the shortest path and its distance are displayed.
- If a path exists, users can enter a message and send it from the sender to the receiver.
- The message is sent via Socket.IO to the backend server, which simulates delivery and triggers a popup at the receiver node.

### 6. **Real-Time Message Visualization**

- When a message is received, a popup appears above the receiver node, showing the delivered message.
- The message popup is animated and disappears after a short duration.
- The connection status to the Socket.IO server is displayed in real-time.

### 7. **Component Overview**

- [`src/App.jsx`](src/App.jsx): Main application logic, state management, and layout.
- [`src/components/ControlsPanel.jsx`](src/components/ControlsPanel.jsx): UI for controlling the algorithm and messaging.
- [`src/components/GraphVisualization.jsx`](src/components/GraphVisualization.jsx): Renders the graph, nodes, edges, and message popups.
- [`src/components/Node.jsx`](src/components/Node.jsx): Renders individual nodes with state-based styling.
- [`src/components/Edge.jsx`](src/components/Edge.jsx): Renders edges with dynamic highlighting.
- [`src/components/MessagePopup.jsx`](src/components/MessagePopup.jsx): Displays message delivery popups.
- [`src/utils/dijkstra.js`](src/utils/dijkstra.js): Dijkstra's algorithm and path reconstruction.
- [`src/utils/socket.js`](src/utils/socket.js): Socket.IO integration for real-time messaging.

---

## Project Structure

```
Interactive-Graph-Visualization-for-Efficient-Pathfinding/
  ├── src/
  │   ├── App.jsx
  │   ├── components/
  │   │   ├── ControlsPanel.jsx
  │   │   ├── GraphVisualization.jsx
  │   │   ├── Node.jsx
  │   │   ├── Edge.jsx
  │   │   └── MessagePopup.jsx
  │   └── utils/
  │       ├── dijkstra.js
  │       ├── graphData.js
  │       ├── priorityQueue.js
  │       └── socket.js
  ├── socket-server/
  │   ├── server.js
  │   └── package.json
  ├── index.html
  ├── package.json
  └── README.md
```

---

## Getting Started

### 1. **Install Dependencies**

```sh
npm install
```

### 2. **Start the Socket.IO Server**

```sh
cd socket-server
npm install
node server.js
```

### 3. **Run the Frontend**

```sh
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Socket Server

The backend server is a simple Node.js/Express app using Socket.IO. It listens for message events and simulates delivery to the receiver node.

- See [`socket-server/server.js`](socket-server/server.js) for details.

---

## Customization

- **Graphs:** Modify or add new graphs in [`src/utils/graphData.js`](src/utils/graphData.js).
- **Algorithm:** The Dijkstra implementation can be extended or replaced in [`src/utils/dijkstra.js`](src/utils/dijkstra.js).
- **UI:** Customize styles in [`src/index.css`](src/index.css) and [`src/App.css`](src/App.css).

---

## License

This project is provided for educational purposes.

---

**Enjoy visualizing Dijkstra's algorithm and experimenting with real-time message passing!**