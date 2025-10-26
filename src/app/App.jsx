import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Visualizer from "../features/visualizer/Visualizer";
import { HomePage } from "../features/Home";
import CustomCursor from "../components/CustomCursor/CustomCursor";

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/app" element={<Navigate to="/visualizer" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
