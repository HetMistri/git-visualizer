import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import CustomCursor from "../components/CustomCursor/CustomCursor";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

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
          <Route path="/home" element={<Landing />} />
          {/* <Route path="/visualizer" element={<Visualizer />} /> */}
          {/* Momentarily Switched to Visualizer as default landing */}{" "}
          <Route path="/" element={<Visualizer />} />
          <Route path="/app" element={<Navigate to="/visualizer" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <SpeedInsights />
      <Analytics />
    </BrowserRouter>
  );
}
