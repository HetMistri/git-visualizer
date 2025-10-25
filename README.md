# Git-Vis: An Interactive Git Visualizer 🚀

An interactive learning tool that demystifies the Git version control system by visualizing its underlying commit graph in real-time. This project demonstrates the practical application of the Directed Acyclic Graph (DAG) data structure with a modern, glassmorphic UI.

**[➡️ View Live Demo](https://your-deployment-link-here.com)**

![Git-Vis Demo](./public/git-vis-demo.gif)

## ✨ Features

### 🎨 Modern UI/UX

- **Glassmorphism Design**: Beautiful frosted-glass aesthetic with backdrop blur effects
- **Interactive Node-Based Graph**: Powered by React Flow for smooth, responsive interactions
- **Branch-Based Coloring**: Each branch has its own distinctive color for easy visual distinction
- **Smooth Animations**: Elegant transitions and hover effects throughout the interface
- **Responsive Layout**: Fully responsive design that works on all screen sizes

### 🔧 Git Operations

- **Commit**: Create new commits on the current branch with custom messages
- **Branch**: Create new branches from the current HEAD position
- **Checkout**: Switch between different branches seamlessly
- **Merge**: Merge branches with visual merge commit representation
- **Rebase**: Replay a branch's unique commits on top of another branch with clear visuals
- **Reset (branch pointer)**: Move the current branch to a selected commit; commits unique to the old tip are shown as orphaned (greyed) and are removed on the next commit

### 📊 Visualization Features

- **Commit Details Modal**: Click any node to view comprehensive commit information
- **Branch Badges**: Visual indicators showing which branches point to each commit
- **Parent Tracking**: Clear visualization of commit parent relationships
- **Merge Commits**: Special styling for merge commits with multiple parents
- **Interactive Controls**: Zoom, pan, and fit-to-view controls
- **Mini Map**: Overview of the entire graph structure

### 🎯 Advanced Features

- **Robust State Management**: React hooks-based state management with useCallback and useMemo
- **Real-time Updates**: Graph updates instantly as you perform operations
- **Color-Coded Branches**:
  - Main/Master: Purple (`#667eea`)
  - Develop: Green (`#4ade80`)
  - Feature: Yellow (`#fbbf24`)
  - Hotfix: Red (`#f87171`)
  - Release: Light Purple (`#a78bfa`)
- **Commit Statistics**: Real-time display of total commits and branches
- **Smart Layout**: Automatic node positioning using BFS algorithm

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://reactjs.org/) with [Vite 7](https://vitejs.dev/)
- **Visualization**: [React Flow](https://reactflow.dev/) (@xyflow/react)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: CSS3 with custom properties and glassmorphism
- **State Management**: React Hooks (useState, useCallback, useMemo)
- **Build Tool**: Vite with Hot Module Replacement (HMR)

## 📚 Project Goals & Learning

The primary goal of this project was to solidify understanding of core data structures by applying them to a real-world, industry-standard tool. Specifically focused on:

- **Data Structure Implementation**: Implementing and managing a Directed Acyclic Graph (DAG) to accurately model Git's commit history
- **State Management**: Handling complex application state with React hooks and ensuring the UI reacts correctly to logical changes
- **Frontend Development**: Building a responsive and interactive user interface with modern design principles
- **Algorithm Implementation**: Using BFS for graph traversal and level calculation
- **UI/UX Design**: Creating an intuitive, visually appealing interface with glassmorphism and smooth animations

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/omeepatel04/git-visualizer.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd git-visualizer
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
5.  **Open your browser:**
    Navigate to `http://localhost:5173`

## 🎮 How to Use

### Basic Operations

1. **Create a Commit**

   - Click the "Commit" button in the toolbar
   - Enter your commit message
   - The new commit appears on the graph

2. **Create a Branch**

   - Click "New Branch" button
   - Enter the branch name
   - Branch is created from current HEAD

3. **Switch Branches**

   - Use the branch dropdown in the toolbar
   - Or click "Checkout" and select a branch

4. **Merge Branches**

   - Click "Merge" button
   - Enter the branch name to merge
   - See the merge commit appear with two parents

5. **View Commit Details**
   - Click on any commit node
   - Modal opens with full commit information
   - See parents, branches, and metadata

### Toolbar Features

**Git Actions Section:**

- 🔵 Commit: Create new commits
- 🟢 New Branch: Create branches
- 🟡 Merge: Merge branches
- 🔴 Reset: Clear the graph

**Current Branch Section:**

- View active branch
- Quick branch switching dropdown

**View Controls:**

- 🔍 Zoom In/Out
- 📐 Fit to View

## 🏗️ Project Structure

```
git-visualizer/
├── src/
│   ├── components/
│   │   ├── App.jsx              # Main application component
│   │   ├── App.css              # App styling
│   │   ├── CustomNode.jsx       # Custom React Flow node
│   │   ├── CustomNode.css       # Node styling
│   │   ├── CommitDetails.jsx    # Commit details modal
│   │   ├── CommitDetails.css    # Modal styling
│   │   ├── Toolbar.jsx          # Toolbar component
│   │   └── Toolbar.css          # Toolbar styling
│   ├── core/
│   │   └── gitGraph.js          # Git graph data structure
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design Principles

### Glassmorphism

- Frosted glass effect with backdrop blur
- Semi-transparent backgrounds
- Subtle borders and shadows
- Layered depth perception

### Color Scheme

- Dark background gradient
- Purple primary color (#667eea)
- Branch-specific color coding
- Semantic colors (success, warning, error)

### Typography

- Inter font family
- Clear hierarchy
- Monospace for commit hashes
- Readable line heights

## 🔮 Future Enhancements

- [x] Rebase operation
- [ ] Cherry-pick commits
- [ ] Tag support
- [ ] Commit history timeline
- [ ] Export graph as image
- [ ] Undo/Redo functionality
- [ ] Multiple graph instances
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts
- [ ] Animation speed controls

## 📖 Core Concepts

### Directed Acyclic Graph (DAG)

The commit history is represented as a DAG where:

- **Nodes**: Commits
- **Edges**: Parent-child relationships
- **Branches**: Pointers to specific commits
- **HEAD**: Pointer to current branch

### Data Structures Used

- **Map**: For O(1) commit lookup
- **Queue**: For BFS traversal
- **Array**: For branch management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Omee Patel**

- GitHub: [@omeepatel04](https://github.com/omeepatel04)

## 🙏 Acknowledgments

- React Flow team for the excellent graph library
- Lucide for beautiful icons
- Git documentation for technical accuracy

---

Made with ❤️ for learning Data Structures & Algorithms
npm run dev
```

The application should now be running on `http://localhost:5173` (or another port specified by Vite).
