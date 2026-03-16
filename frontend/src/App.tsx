import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getProfile } from "@/lib/store";
import AppLayout from "@/components/layout/AppLayout";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import CycleTrackerPage from "./pages/CycleTrackerPage";
import PCOSDetectionPage from "./pages/PCOSDetectionPage";
import DietPlanPage from "./pages/DietPlanPage";
import ExercisePage from "./pages/ExercisePage";
import YogaPage from "./pages/YogaPage";
import DailyCarePage from "./pages/DailyCarePage";
import NotFound from "./pages/NotFound";
import HealthDashboardPage from "./pages/HealthDashboardPage"

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const profile = getProfile();
  if (!profile) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cycle" element={<CycleTrackerPage />} />
            <Route path="/pcos" element={<PCOSDetectionPage />} />
            <Route path="/diet" element={<DietPlanPage />} />
            <Route path="/exercise" element={<ExercisePage />} />
            <Route path="/yoga" element={<YogaPage />} />
            <Route path="/daily-care" element={<DailyCarePage />} />
            <Route path="/health-dashboard" element={<HealthDashboardPage/>}/>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
