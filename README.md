# Flow Chart Domain-Specific Language (DSL)

A visual domain-specific language for creating and editing flow diagrams with automatic code generation capabilities. This project implements a graphical DSL that allows users to design flow charts with additional features such as simulation and generating scripts.

## Overview

This code editor provides a graphical interface for creating flow diagrams with built-in validation and simulation features. It's designed for both technical and non-technical users to design flowchart for visual representation (such as using it for meeting), as well as workflow simulations (with actual run test).

### Key Features
- **Multiple Node Types**: Support for various flow chart elements:
  - State nodes (start/end states)
  - Process nodes (actions/operations)
  - Decision nodes (conditional branching)
- **Connections**: Port-based connection system between nodes
- **Validation Support**: Real-time validation of diagram structure and semantics
- **Simulation**: Basic support for simulating simple actions based on user-defined variables
- **M2M**: Automatic generation of tree model in Python code from AST

## Installation

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- A modern web browser 

### Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Creating a New Flow Chart

1. Use the toolbar to add nodes:
   - Click the node type you want to add on the left of the toolbar

2. Connect nodes:
   - Select the node , then click and drag from one node's port to another

### Editing Elements

- **Move Nodes**: Click and drag nodes to reposition them
- **Edit Text**: Double-click on a node to edit its label
- **Delete Elements**: Select and press the Delete keyboard button
- **Modify Connections**: Click on connections to select and modify them in the toolbar

### Validation

 - Validation will be automatically done when there is change in flowchart
 - A flowchart is valid if:
   - All nodes are connected
   - There is atmost one link coming out from State and Process
   - Process node need to have exactly two link coming out 

## Examples

There are examples in the toolbar as a template:
1. Process Flow: Simple linear flow with three processes
2. Decision Tree: A simple decision tree that consist two processes based on the decision node
3. Simple Loop: A simple loop that loops around the process and decision until the condition is false

## Static Analysis

Static Analysis can be done by clicking Show AST button
- Number of Total Nodes
- Number of Decision Nodes
- Maximum Depth
- Average Branching Factor
- Cyclomatic Complexity
- Current structure of the AST

## Simulation

There are additional requirements for simulation:
- There must be one and only one start state.
- Loops are not supported in simulation.
- Decision node must have conditions, and with one True and one False branch

Click the Custom Variable button on toolbar to define variables (integer or Boolean)
Edit the text label on Process to simulate basic actions (x + 1, x - 1, x * 1)
Edit the text label on Decision to simulate conditions (x == 1, done == true)

Simulation will only be completed when it ends with end state, else it will be interrupted.

Logs of simulation will be shown under the editor

## M2M

Transform the current flowchart to representation in Python by clicking on Generate Script button.
The output model will be a tree structure in Python.
_Other languages will be supported in upcoming future updates_

## Built With

- React - Frontend framework
- GoJS - Diagramming library
- styled-components - Styling solution


