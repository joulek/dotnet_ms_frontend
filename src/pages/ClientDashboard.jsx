// src/pages/ClientDashboard.jsx
import "../styles/dashboards-client.css";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ClientDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  // ⭐ STATES KPI
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [claimsCount, setClaimsCount] = useState(0);

  // ⭐ Load KPI depuis tes APIs
  async function loadDashboard() {
    try {
      const token = localStorage.getItem("token");

      // 🧾 Commandes
      const ordersRes = await axios.get(
        "https://localhost:7053/gateway/orders/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrdersCount(ordersRes.data.length);
      setTotalPaid(
        ordersRes.data.reduce((acc, o) => acc + o.totalAmount, 0)
      );

      // 📩 Réclamations
      const claimsRes = await axios.get(
        "https://localhost:7053/gateway/claims/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClaimsCount(claimsRes.data.length);
    } catch (e) {
      console.log("Erreur dashboard:", e);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <>
      <Navbar />
      <div className="client-dashboard">

        <h1 className="dash-title">
          👋 Bienvenue {user?.fullName}
        </h1>

        <p className="dash-subtitle">
          Votre espace client personnel
        </p>

        {/* ⭐ CARDS KPI */}
        <div className="dash-cards">
          
          <div className="dash-card">
            <h3>📦 Commandes</h3>
            <p className="dash-number">{ordersCount}</p>
          </div>

          <div className="dash-card">
            <h3>💰 Total payé</h3>
            <p className="dash-number">{totalPaid} DT</p>
          </div>

          <div className="dash-card">
            <h3>📢 Réclamations</h3>
            <p className="dash-number">{claimsCount}</p>
          </div>

          <div className="dash-card">
            <h3>⭐ Satisfaction</h3>
            <p className="dash-number">92%</p>
          </div>

        </div>

        {/* ⭐ Section infos */}
        <div className="dash-section">
          <h2>📊 Aperçu général</h2>
          <p>
            Retrouvez vos statistiques principales, vos commandes, vos réclamations
            et vos informations personnelles depuis cet espace.
          </p>
        </div>

      </div>
    </>
  );
}
