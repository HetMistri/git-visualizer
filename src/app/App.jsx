import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import CustomCursor from "../components/CustomCursor/CustomCursor";

// Lazy load routes for better performance
const Visualizer = lazy(() => import("../features/visualizer/Visualizer"));
const Landing = lazy(() =>
  import("@/features/landing").then((module) => ({ default: module.Landing }))
);
const NotFound = lazy(() =>
  import("@/features/NotFound").then((module) => ({ default: module.NotFound }))
);

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Suspense fallback={<LoadingSpinner message="Loading Git-Vis..." />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/app" element={<Navigate to="/visualizer" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
