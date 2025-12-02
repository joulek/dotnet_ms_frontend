import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { FaHome, FaBoxOpen, FaUsers, FaSignOutAlt, FaTools, FaEnvelopeOpenText, FaClipboardList } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className="bottom-nav"
      style={{
        justifyContent:
          user?.role !== "Admin" ? "space-evenly" : "space-around",
      }}
    >
      {/* 🏠 Accueil */}
      <NavLink
        to="/dashboard/client"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        <FaHome className="nav-icon" />
        <span className="nav-text">Accueil</span>
      </NavLink>

      {/* 📦 Articles */}
      <NavLink
        to="/articles"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        <FaBoxOpen className="nav-icon" />
        <span className="nav-text">Articles</span>
      </NavLink>

      {/* 🛠 Interventions (Admin + Technicien) */}
      {(user?.role === "Admin" || user?.role === "Technicien") && (
        <NavLink
          to="/interventions"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaTools className="nav-icon" />
          <span className="nav-text">Interventions</span>
        </NavLink>
      )}

      {/* 👥 Clients (Admin uniquement) */}
      {user?.role === "Admin" && (
        <NavLink
          to="/clients"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaUsers className="nav-icon" />
          <span className="nav-text">Clients</span>
        </NavLink>
      )}

      {/* 📬 Réclamation (Client uniquement) */}
      {user?.role === "Client" && (
        <NavLink
          to="/reclamation/nouvelle"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaEnvelopeOpenText className="nav-icon" />
          <span className="nav-text">Réclamation</span>
        </NavLink>
      )}

      {/* 📋 Réclamations (Admin + Technicien) */}
      {["Admin", "Technicien"].includes(user?.role) && (
        <NavLink
          to="/admin/reclamations"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaClipboardList className="nav-icon" />
          <span className="nav-text">Réclamations</span>
        </NavLink>
      )}

<NavLink to="/profil" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
  👤 Mon Profil
</NavLink>

      {/* 🚪 Déconnexion */}
      <button className="nav-item logout-btn" onClick={handleLogout}>
        <FaSignOutAlt className="nav-icon" />
        <span className="nav-text">Logout</span>
      </button>
    </div>
  );
}
