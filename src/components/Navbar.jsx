import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo">🔧 MTR-Ressorts</h2>
      </div>

      <div className="navbar-center">
        <Link to="/dashboard/client" className="nav-link">Accueil</Link>
        <Link to="/articles" className="nav-link">Articles</Link>



        {user?.role === "Admin" && (
          <Link to="/clients" className="nav-link">Clients</Link>
        )}

      </div>

      <div className="navbar-right">
        <span className="nav-user">👤 {user?.fullName}</span>
        <button className="btn-logout" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </nav>
  );
}
