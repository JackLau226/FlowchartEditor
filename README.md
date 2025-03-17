# Flow Chart Editor

A React-based flow chart editor that allows users to create and edit flow diagrams with various node types and connections. Built with GoJS for robust diagramming capabilities.

## Features

- Create and edit flow chart diagrams
- Multiple node types: State, Process, and Decision
- Customizable node colors and styles
- Grid toggle for precise positioning
- Text and Turtle representation of diagrams
- Drag and drop interface
- Port-based connections with visual feedback
- Undo/redo support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/6ccs3mde-7ccsmmdd-classroom-2024-25/coursework-JackLau226.git
   cd coursework-JackLau226
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

1. **Creating Nodes**
   - Click the "Add State", "Add Process", or "Add Decision" buttons to add nodes
   - Drag nodes to position them on the canvas

2. **Connecting Nodes**
   - Hover over a node to see connection ports
   - Click and drag from one port to another to create a connection

3. **Customizing Nodes**
   - Select a node to modify its text color and border color
   - Resize nodes by dragging their edges

4. **Grid and View Options**
   - Toggle grid visibility for precise alignment
   - View text or Turtle representation of your diagram

## Project Structure

```
src/
├── components/
│   └── GraphEditor/
│       ├── components/
│       │   └── Toolbar.js
│       ├── templates/
│       │   ├── linkTemplate.js
│       │   └── nodeTemplate.js
│       ├── utils/
│       │   └── diagramUtils.js
│       ├── styles.js
│       └── GraphEditor.js
├── App.js
├── App.css
├── index.js
└── index.css
```

## Built With

- [React](https://reactjs.org/) - Web framework
- [GoJS](https://gojs.net/) - Diagramming library
- [styled-components](https://styled-components.com/) - Styling solution

## License

This project is part of the coursework for 6CCS3MDE/7CCSMMDD at King's College London.
