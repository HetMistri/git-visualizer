import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactFlowProvider } from "@xyflow/react";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import App from "./components/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </ThemeProvider>
  </StrictMode>
);
