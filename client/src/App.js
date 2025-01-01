import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateTemplate from "./components/CreateTemplate";
import TemplateDetails from "./components/TemplateDetails";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/is-verified`, {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      setIsAuthenticated(parseRes === true);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/create-template"
          element={isAuthenticated ? <CreateTemplate /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/template/:id"
          element={isAuthenticated ? <TemplateDetails /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
