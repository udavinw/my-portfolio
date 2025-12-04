import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portfolio from "./Portfolio";
import NotFound from "./NotFound";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/Login";
import ProtectedRoute from "./admin/ProtectedRoute";
import ProjectsPage from "./ProjectsPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/" element={<Portfolio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;