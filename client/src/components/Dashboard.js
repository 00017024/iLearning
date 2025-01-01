import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [latestTemplates, setLatestTemplates] = useState([]);
  const [favoriteTemplates, setFavoriteTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch the user's name
  async function getName() {
    try {
      const response = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parseRes = await response.json();
      setName(parseRes.user_name || "User");
    } catch (err) {
      console.error(err.message);
      alert("Failed to fetch user name.");
    }
  }

  // Fetch templates grouped by latest and favorite
  async function fetchTemplates() {
    try {
      const response = await fetch("http://localhost:5000/templates", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const templates = await response.json();
      setLatestTemplates(templates.latest || []);
      setFavoriteTemplates(templates.favorites || []);
    } catch (err) {
      console.error(err.message);
      alert("Failed to fetch templates.");
    }
  }

  // Handle search query
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/templates/search?query=${query}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const results = await response.json();
      setSearchResults(results || []);
    } catch (err) {
      console.error(err.message);
      alert("Search failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to template creation
  const redirectToAddTemplate = () => {
    navigate("/create-template");
  };

  // Logout function
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  useEffect(() => {
    getName();
    fetchTemplates();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Template Forms</h1>
      <h2>Welcome, {name}</h2>
      <button className="btn btn-primary" onClick={logout}>
        Logout
      </button>
      <div className="my-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {isLoading && <p>Loading search results...</p>}
        <ul className="list-group mt-3">
          {searchResults.map((template) => (
            <li
              key={template.id}
              className="list-group-item"
              onClick={() => navigate(`/template/${template.id}`)}
            >
              {template.title}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Latest Templates</h3>
        <ul className="list-group">
          {latestTemplates.map((template) => (
            <li
              key={template.id}
              className="list-group-item"
              onClick={() => navigate(`/template/${template.id}`)}
            >
              {template.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h3>Most Favorite Templates</h3>
        <ul className="list-group">
          {favoriteTemplates.map((template) => (
            <li
              key={template.id}
              className="list-group-item"
              onClick={() => navigate(`/template/${template.id}`)}
            >
              {template.title}
            </li>
          ))}
        </ul>
      </div>
      <button className="btn btn-success mt-4" onClick={redirectToAddTemplate}>
        Add a Template
      </button>
    </div>
  );
};

export default Dashboard;
