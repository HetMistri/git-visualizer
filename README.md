# Git-Vis: An Interactive Git Visualizer 🚀

An interactive learning tool that demystifies the Git version control system by visualizing its underlying commit graph in real-time. This project demonstrates the practical application of the Directed Acyclic Graph (DAG) data structure.

**[➡️ View Live Demo](https://your-deployment-link-here.com)** ---

![Git-Vis Demo GIF](./public/git-vis-demo.gif)
## ✨ Features

* **Visualize the Commit Graph**: See your Git history as a clear, interactive node-based graph.
* **Interactive Git Commands**: Perform basic Git operations through a simple UI:
    * `commit`: Create new commits on the current branch.
    * `branch`: Create new branches from any commit.
    * `merge`: Merge one branch into another, creating a merge commit.
* **Advanced Visualizations**: Understand complex operations with clear animations:
    * `rebase`: Watch as commits are replayed onto a new base branch. * **Branch & HEAD Pointers**: Clearly see where your branches and the `HEAD` are pointing at all times.
* **Interactive UI**: Pan, zoom, and click on nodes to inspect their details.

## 🛠️ Tech Stack

* **Frontend**: [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
* **Visualization**: [React Flow](https://reactflow.dev/)
* **Styling**: CSS Modules / [Chakra UI](https://chakra-ui.com/) * **Deployment**: [Vercel](https://vercel.com/)

## 📚 Project Goals & Learning

The primary goal of this project was to solidify my understanding of core data structures by applying them to a real-world, industry-standard tool. Specifically, I focused on:

* **Data Structure Implementation**: Implementing and managing a Directed Acyclic Graph (DAG) to accurately model Git's commit history.
* **State Management**: Handling complex application state and ensuring the UI reacts correctly to logical changes.
* **Frontend Development**: Building a responsive and interactive user interface with React and a specialized visualization library.

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/interactive-git-graph.git](https://github.com/your-username/interactive-git-graph.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd interactive-git-graph
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```

The application should now be running on `http://localhost:5173` (or another port specified by Vite).