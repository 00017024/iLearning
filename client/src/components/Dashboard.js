import React, { useState, useEffect } from "react";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");

  // Fetch the user's name from the server
  async function getName() {
    try {
      const response = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      setName(parseRes.user_name || "User"); // Fallback to "User" if `user_name` is undefined
    } catch (err) {
      console.error(err.message);
    }
  }

  // Handle logout
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  // Fetch name on component mount
  useEffect(() => {
    getName();
  }, []);

  return (
    <div>
        <h1>Template Forms</h1>
        <h2>Welcome, {name}</h2>
        <button className="btn btn-primary" onClick={logout}>
            Logout
        </button>
    </div>
  );
};

export default Dashboard;

