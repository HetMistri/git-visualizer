import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Visualizer from "../features/visualizer/Visualizer";
import { HomePage } from "../features/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/app" element={<Navigate to="/visualizer" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
