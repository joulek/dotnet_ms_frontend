import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAllArticles,
  getAllClients,
  getAllInterventions,
  getAllReclamations,
} from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../styles/dashboards.css";

// ⭐ Registration Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [articles, setArticles] = useState(0);
  const [clients, setClients] = useState(0);
  const [interventions, setInterventions] = useState(0);
  const [reclamations, setReclamations] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const a = await getAllArticles();
      const c = await getAllClients();
      const i = await getAllInterventions();
      const r = await getAllReclamations();

      setArticles(a.data.length);
      setClients(c.data.length);
      setInterventions(i.data.length);
      setReclamations(r.data.length);
    } catch (err) {
      console.log("❌ Erreur dashboard :", err);
    }
  };

  const chartData = {
    labels: ["Articles", "Clients", "Interventions", "Réclamations"],
    datasets: [
      {
        label: "Totaux",
        data: [articles, clients, interventions, reclamations],
        backgroundColor: ["#a5cdfd", "#b5ffd5", "#ffe3ac", "#ffc6c6"],
        borderColor: ["#6aa5df", "#62cc92", "#e4b45e", "#d67a7a"],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-wrapper">
        <h1 className="dashboard-title">
          👋 Bienvenue {user?.fullName}
        </h1>
        <p className="subtitle">
          Vous êtes connecté en tant que <strong>{user?.role}</strong>.
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{articles}</h3>
            <p>Articles</p>
          </div>
          <div className="stat-card">
            <h3>{clients}</h3>
            <p>Clients</p>
          </div>
          <div className="stat-card">
            <h3>{interventions}</h3>
            <p>Interventions</p>
          </div>
          <div className="stat-card">
            <h3>{reclamations}</h3>
            <p>Réclamations</p>
          </div>
        </div>

        <div className="chart-container">
          <Bar data={chartData} />
        </div>
      </div>
    </>
  );
}
