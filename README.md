# Git-Vis: An Interactive Git Visualizer 🚀

An interactive learning tool that demystifies the Git version control system by visualizing its underlying commit graph in real-time. This project demonstrates the practical application of the Directed Acyclic Graph (DAG) data structure with a modern, glassmorphic UI and feature-based architecture.

**[➡️ View Live Demo](https://git-visualizer-lemon.vercel.app/)**

![Git-Vis Demo](./public/git-vis-demo.gif)


## ✨ Features

### 🎨 Modern UI/UX

- **Interactive Node-Based Graph**: Powered by React Flow for smooth, responsive interactions
- **Branch-Based Coloring**: Each branch has its own distinctive color for easy visual distinction
- **Smooth Animations**: Elegant transitions using Framer Motion throughout the interface
- **Dark/Light Theme Toggle**: Switch between dark and light themes seamlessly
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
- **Error Boundary**: Graceful error handling with fallback UI and recovery options
- **Loading States**: Smooth loading spinners during route transitions
- **Lazy Loading**: Code-split routes for optimal performance
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
- **Error Handling**: React Error Boundary for graceful failures
- **Code Splitting**: Lazy loading with React.lazy() and Suspense
- **Code Organization**: Feature-based modules with barrel exports
- **Design System**: Atomic design principles with reusable UI components
- **Theme System**: CSS variables with dark/light mode support
- **Performance**: Optimized builds with chunk splitting (vendor, reactflow, animations)

## 🎭 Production Features

### Error Resilience

- **Error Boundary Component**: Catches React runtime errors
- **Graceful Fallback UI**: User-friendly error messages with recovery options
- **Development Mode**: Detailed stack traces for debugging
- **Production Mode**: Clean error UI without exposing internals

### Performance Optimization

- **Code Splitting**: Route-level lazy loading reduces initial bundle size
- **Loading States**: Smooth loading spinner during navigation
- **Chunk Optimization**: Separate bundles for vendor, reactflow, and animations
- **Build Size**: ~850KB raw, ~290KB gzipped
- **Fast HMR**: Instant hot module replacement in development

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

## 📖 Core Concepts

### Directed Acyclic Graph (DAG)

The commit history is represented as a DAG where:

- **Vertices/Nodes**: Commits (each with a unique SHA-1 hash)
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


## 👨‍💻 Authors

**Omee Patel**

- GitHub: [@omeepatel04](https://github.com/omeepatel04)

**Het Mistri**

- GitHub: [@HetMistri](https://github.com/HetMistri)

## 🙏 Acknowledgments

- React Flow team for the excellent graph library
- Lucide for beautiful icons
- GSAP for powerful animations
- Vercel for seamless deployment
- Git documentation for technical accuracy

---

**Made with ❤️ for learning Data Structures & Algorithms**

_Live at: [https://git-visualizer-lemon.vercel.app/](https://git-visualizer-lemon.vercel.app/)_

_Report Bugs at: [https://git-visualizer-lemon.vercel.app/](https://git-visualizer-lemon.vercel.app/)_
