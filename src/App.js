import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portfolio from "./Portfolio";
import NotFound from "./NotFound";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/Login";
import ProtectedRoute from "./admin/ProtectedRoute";
import Preloader from "./Preloader";
import { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 800); // Match this with the CSS transition duration
    }, 3000); // 3s preloader display time

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 0.8s ease-in-out",
          }}
        >
          <Preloader text="UDAVIN" />
        </div>
      )}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 0.8s ease-in-out",
        }}
      >
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
            <Route path="/" element={<Portfolio />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;