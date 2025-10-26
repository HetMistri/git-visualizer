# Git-Vis: An Interactive Git Visualizer 🚀

An interactive learning tool that demystifies the Git version control system by visualizing its underlying commit graph in real-time. This project demonstrates the practical application of the Directed Acyclic Graph (DAG) data structure with a modern, glassmorphic UI and feature-based architecture.

**[➡️ View Live Demo](https://your-deployment-link-here.com)**

![Git-Vis Demo](./public/git-vis-demo.gif)

> **Note**: This project has been completely refactored with a modern feature-based architecture, atomic UI components, and modular design system.

## ✨ Features

### 🎨 Modern UI/UX

- **Glassmorphism Design**: Beautiful frosted-glass aesthetic with backdrop blur effects
- **Animated Landing Page**: GSAP-powered scroll animations with smooth transitions
- **Interactive Node-Based Graph**: Powered by React Flow for smooth, responsive interactions
- **Branch-Based Coloring**: Each branch has its own distinctive color for easy visual distinction
- **Smooth Animations**: Elegant transitions using Framer Motion throughout the interface
- **Dark/Light Theme Toggle**: Switch between dark and light themes seamlessly
- **Responsive Layout**: Fully responsive design that works on all screen sizes
- **Atomic UI Components**: Reusable Button, Card, Modal, Input, and Badge components

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

### Core Technologies

- **Frontend Framework**: [React 19.1](https://reactjs.org/) with modern hooks
- **Build Tool**: [Vite 7.x](https://vitejs.dev/) with Hot Module Replacement (HMR)
- **Visualization**: [React Flow 12.9](https://reactflow.dev/) (@xyflow/react)
- **Styling**: CSS3 with custom properties, CSS variables, and glassmorphism

### UI & Animations

- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for micro-interactions
- **Scroll Animations**: [GSAP](https://greensock.com/gsap/) with ScrollTrigger

### Architecture & Patterns

- **State Management**: React Hooks (useState, useCallback, useMemo, custom hooks)
- **Code Organization**: Feature-based modules with barrel exports
- **Design System**: Atomic design principles with reusable UI components
- **Theme System**: CSS variables with dark/light mode support

## 📚 Project Goals & Learning

The primary goal of this project was to solidify understanding of core data structures and modern software architecture by applying them to a real-world, industry-standard tool. Key learning outcomes:

### Data Structures & Algorithms

- **DAG Implementation**: Implementing and managing a Directed Acyclic Graph to accurately model Git's commit history
- **BFS Algorithm**: Using breadth-first search for graph traversal and level calculation
- **State Management**: Handling complex application state with immutability and React hooks
- **Performance Optimization**: Using useMemo and useCallback for expensive computations

### Software Architecture

- **Feature-Based Architecture**: Organizing code into self-contained, domain-driven modules
- **Atomic Design**: Building reusable UI components from atoms to organisms
- **Separation of Concerns**: Decoupling business logic, UI components, and styling
- **Barrel Exports**: Clean import/export patterns for better code organization

### Frontend Development

- **Modern React**: Using React 19 with latest hooks and patterns
- **Animation Systems**: Implementing GSAP scroll animations and Framer Motion micro-interactions
- **Theme System**: Building a dynamic theme system with CSS variables
- **Responsive Design**: Creating mobile-first, accessible interfaces
- **Component API Design**: Designing intuitive, composable component interfaces

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

This project follows a **feature-based architecture** with atomic design principles:

```
src/
├── app/                          # Application core
│   ├── App.jsx                  # Main orchestrator (565 lines)
│   └── App.css                  # App-specific styles
│
├── features/                     # Feature modules (self-contained)
│   ├── landing/                 # Landing page feature
│   │   ├── index.js            # Barrel exports
│   │   ├── Landing.jsx         # Main component
│   │   ├── Landing.css         # Feature styles
│   │   ├── components/         # Sub-components
│   │   │   ├── Hero.jsx        # Hero section with CTA
│   │   │   ├── Features.jsx    # Feature showcase
│   │   │   ├── Demo.jsx        # Interactive demo
│   │   │   ├── Stats.jsx       # Statistics section
│   │   │   ├── CTA.jsx         # Call-to-action
│   │   │   └── Footer.jsx      # Footer
│   │   └── animations/
│   │       └── scrollAnimations.js  # GSAP ScrollTrigger
│   │
│   └── visualizer/              # Git visualizer feature
│       ├── index.js            # Barrel exports
│       ├── components/         # Feature components
│       │   ├── Toolbar/        # Git operations toolbar
│       │   ├── Terminal/       # Git command terminal
│       │   ├── CommitDetails/  # Commit info modal
│       │   ├── Graph/          # React Flow graph
│       │   │   ├── CustomNode.jsx
│       │   │   └── CustomEdge.jsx
│       │   └── Modals/         # Input modals
│       │       ├── InputModal.jsx
│       │       └── RebaseModal.jsx
│       ├── hooks/              # Feature hooks
│       │   ├── useGitGraph.js  # Git graph state
│       │   └── useRebaseAnimation.js
│       ├── core/               # Business logic
│       │   └── gitGraph.js    # Git operations (410 lines)
│       └── utils/              # Feature utilities
│           └── graphLayout.js  # BFS layout (375 lines)
│
├── components/                   # Shared components
│   ├── ui/                      # Atomic UI components
│   │   ├── Button/             # Reusable button
│   │   ├── Card/               # Card component
│   │   ├── Modal/              # Modal dialog
│   │   ├── Input/              # Input field
│   │   └── Badge/              # Badge component
│   └── layout/                  # Layout components
│       ├── ThemeToggle/        # Theme switcher
│       └── HomeButton/         # Navigation button
│
├── styles/                       # Global styles
│   ├── index.css               # Entry point (290 lines)
│   ├── variables.css           # Design tokens (64 lines)
│   │                           # - Z-index layers
│   │                           # - Spacing scale
│   │                           # - Typography
│   │                           # - Transitions
│   └── themes.css              # Color schemes (86 lines)
│                               # - Dark theme (default)
│                               # - Light theme
│
├── utils/                        # Shared utilities
│   └── animations.js           # Framer Motion variants
│
├── context/                      # React contexts
│   └── ThemeContext.jsx        # Theme provider
│
├── assets/                       # Static assets
│   └── logo.png
│
└── main.jsx                      # App entry point
```

### Architecture Highlights

✅ **Feature-based modules**: Self-contained features with their own components, hooks, and logic  
✅ **Atomic UI components**: Highly reusable, prop-driven UI elements  
✅ **Barrel exports**: Clean imports through index.js files  
✅ **Modular styles**: Separated variables, themes, and global styles  
✅ **Clear separation of concerns**: Business logic, UI, and styling are decoupled  
✅ **Scalable structure**: Easy to add new features or components

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

- [x] Rebase operation with visual animation
- [x] Dark/Light theme toggle
- [x] Animated landing page with GSAP
- [x] Feature-based architecture
- [x] Atomic UI components
- [ ] Cherry-pick commits
- [ ] Tag support
- [ ] Commit history timeline
- [ ] Export graph as image/SVG
- [ ] Undo/Redo functionality
- [ ] Multiple graph instances (tabs)
- [ ] Keyboard shortcuts
- [ ] Animation speed controls
- [ ] Git command history export
- [ ] Interactive tutorial mode
- [ ] Custom branch color picker

## 📖 Core Concepts

### Directed Acyclic Graph (DAG)

The commit history is represented as a DAG where:

- **Nodes**: Commits (each with a unique SHA-1 hash)
- **Edges**: Parent-child relationships
- **Branches**: Pointers to specific commits
- **HEAD**: Pointer to current branch

### Data Structures Used

- **Map**: For O(1) commit lookup by hash
- **Queue**: For BFS traversal and level calculation
- **Array**: For branch management and tracking
- **Set**: For efficient cycle detection

### Algorithms Implemented

- **BFS (Breadth-First Search)**: For graph traversal and level calculation
- **Topological Sort**: For commit ordering
- **Branch Coloring**: Deterministic color assignment based on branch names
- **Layout Algorithm**: Custom algorithm for node positioning

## 🎯 Component API

### Atomic UI Components

All components in `src/components/ui/` follow consistent patterns:

#### Button Component

```jsx
import { Button } from "@/components/ui";

<Button
  variant="primary|secondary|danger|ghost"
  size="small|medium|large"
  icon={<Icon />}
  onClick={handleClick}
>
  Click Me
</Button>;
```

#### Card Component

```jsx
import { Card } from "@/components/ui";

<Card>
  <Card.Icon>{icon}</Card.Icon>
  <Card.Title>Title</Card.Title>
  <Card.Description>Description</Card.Description>
</Card>;
```

#### Modal Component

```jsx
import { Modal } from "@/components/ui";

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  size="small|medium|large|fullscreen"
  title="Modal Title"
>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>;
```

### Feature Exports

#### Landing Feature

```jsx
import { Landing } from "@/features/landing";
// Self-contained landing page with GSAP animations
```

#### Visualizer Feature

```jsx
import {
  Toolbar,
  Terminal,
  Graph,
  CommitDetails,
  useGitGraph,
  useRebaseAnimation,
} from "@/features/visualizer";
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes following the existing architecture patterns
4. Test your changes (`npm run build`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Code Style

- Follow the existing feature-based structure
- Use barrel exports for all modules
- Write semantic, accessible HTML
- Use CSS variables from the design system
- Add JSDoc comments for complex functions

## 🏆 Project Evolution

This project underwent a complete refactoring from a monolithic structure to a modern, scalable architecture:

### Phase 1-2: Foundation

- Created 8 atomic UI components (Button, Card, Modal, Input, Badge, ThemeToggle, HomeButton)
- Established component API patterns and design system

### Phase 3: Landing Feature

- Built animated landing page with GSAP ScrollTrigger
- Created 6 sub-components (Hero, Features, Demo, Stats, CTA, Footer)
- Implemented smooth scroll animations and interactions

### Phase 4: Visualizer Feature

- Extracted all visualizer components into feature module
- Migrated custom hooks (useGitGraph, useRebaseAnimation)
- Moved core Git logic and layout algorithms
- Created comprehensive barrel exports

### Phase 5: App Integration

- Relocated App.jsx to dedicated app/ directory
- Centralized application orchestration
- Optimized bundle size (646 KB → 531 KB)

### Phase 6: Styles Reorganization

- Separated CSS into variables, themes, and global styles
- Created modular design system with CSS custom properties
- Organized z-index, spacing, typography, and timing tokens

### Phase 6.5: Cleanup

- Removed 17 duplicate files from old structure
- Eliminated empty directories
- Validated production build (531 KB JS, 54 KB CSS)

**Result**: A maintainable, scalable codebase ready for future features 🎉

## 📊 Build Information

- **Bundle Size**: 531 KB (gzipped: 170 KB)
- **CSS Size**: 54 KB (gzipped: 9.66 KB)
- **Modules**: 2216 transformed
- **Build Time**: ~4 seconds

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
```
