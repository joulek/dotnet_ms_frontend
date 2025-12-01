import React from "react";
import "../styles/dashboards.css";
import Navbar from "../components/Navbar";
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
     <>
      <Navbar />
    <div className="container">
      <h1>👋 Bienvenue {user?.fullName} !</h1>
      <p>Vous êtes connecté en tant que <strong>{user?.role}</strong>.</p>
      <p>Voici votre espace admin.</p>

     
    </div>
       </>
  );
}

