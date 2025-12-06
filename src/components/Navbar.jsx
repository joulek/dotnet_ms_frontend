import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import {
  FaHome,
  FaBoxOpen,
  FaUsers,
  FaSignOutAlt,
  FaTools,
  FaEnvelopeOpenText,
  FaClipboardList,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || "?";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar-container">

      {/* 🧍 Avatar + lettre */}
      <div className="sidebar-profile">
        <div className="profile-initial">{userInitial}</div>
        <h3 className="profile-name">{user?.fullName}</h3>
      </div>

      <div className="sidebar-menu">
        {/* 🏠 Accueil */}
        <NavLink
          to={user?.role === "Admin" ? "/dashboard/admin" : "/dashboard/client"}
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaHome className="sidebar-icon" />
          <span>Accueil</span>
        </NavLink>

        {/* 📦 Articles */}
        <NavLink
          to="/articles"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaBoxOpen className="sidebar-icon" />
          <span>Articles</span>
        </NavLink>

        {/* 🛠 Interventions (Admin + Technicien) */}
        {(user?.role === "Admin" || user?.role === "Technicien") && (
          <NavLink
            to="/interventions"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaTools className="sidebar-icon" />
            <span>Interventions</span>
          </NavLink>
        )}

        {/* 👥 Clients (Admin) */}
        {user?.role === "Admin" && (
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaUsers className="sidebar-icon" />
            <span>Clients</span>
          </NavLink>
        )}

        {/* 📬 Réclamation (Client) */}
        {user?.role === "Client" && (
          <NavLink
            to="/reclamation/nouvelle"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaEnvelopeOpenText className="sidebar-icon" />
            <span>Réclamer</span>
          </NavLink>
        )}

        {/* 📋 Réclamations (Admin + Technicien) */}
        {["Admin", "Technicien"].includes(user?.role) && (
          <NavLink
            to="/admin/reclamations"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaClipboardList className="sidebar-icon" />
            <span>Réclamations</span>
          </NavLink>
        )}

        {user?.role === "Client" && (
          <NavLink
            to="/profile/me"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaUsers className="sidebar-icon" />
            <span>Mon Profil</span>
          </NavLink>
        )}

        {/* 🛒 Panier (Client uniquement) */}
        {user?.role === "Client" && (
          <NavLink
            to="/client/cart"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaBoxOpen className="sidebar-icon" />
            <span>Mon Panier</span>
          </NavLink>
        )}

        {/* 📦 Commandes (Client uniquement) */}
        {user?.role === "Client" && (
          <NavLink
            to="/client/orders"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            <FaClipboardList className="sidebar-icon" />
            <span>Mes Commandes</span>
          </NavLink>
        )}

      </div>


      {/* 🚪 Déconnexion */}
      <button className="sidebar-item logout-btn" onClick={handleLogout}>
        <FaSignOutAlt className="sidebar-icon" />
        <span>Déconnexion</span>
      </button>
    </div>
  );
}
