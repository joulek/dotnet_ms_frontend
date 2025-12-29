import { useEffect, useState } from "react";
import {
  getAllReclamations,
  updateEtatReclamation,
} from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/reclamation.css";

export default function ReclamationsAdminPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reclamations, setReclamations] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!["Admin", "Technicien"].includes(user?.role)) return;
    loadRecs();
  }, []);

  const loadRecs = () => {
    getAllReclamations()
      .then((res) => setReclamations(res.data))
      .catch(() => setError("❌ Impossible de charger les réclamations"));
  };

  const getEtatLabel = (etat) => {
    switch (etat) {
      case 1:
        return "Ouverte";
      case 2:
        return "EnCours";
      case 3:
        return "Resolue";
      default:
        return "Inconnu";
    }
  };

  const changeEtat = async (id, newEtat) => {
    try {
      await updateEtatReclamation(id, newEtat);
      setSuccess("✔ État de la réclamation modifié avec succès !");
      setTimeout(() => setSuccess(""), 2000);
      loadRecs();
    } catch {
      alert("⚠ Erreur modification état");
    }
  };

  if (!["Admin", "Technicien"].includes(user?.role))
    return <p style={{ textAlign: "center", marginTop: 20 }}>⛔ Accès refusé</p>;

  return (
    <>
      <Navbar />

      <div className="recs-container">
        <h1>Liste des réclamations</h1>

        {success && <div className="message-box success">{success}</div>}
        {error && <div className="message-box error">{error}</div>}

        <div className="table-wrapper">
          <table className="recs-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Objet</th>
                <th>Description</th>
                <th>Date</th>
                <th>État</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reclamations.map((r) => (
                <tr key={r.id}>
                  <td>{r.clientName}</td>
                  <td>{r.objet}</td>
                  <td>{r.description}</td>
                  <td>{r.dateReclamation?.substring(0, 10)}</td>

                  {/* ⭐ BADGE STATUT */}
                  <td data-etat={getEtatLabel(r.etat)}>
                    {getEtatLabel(r.etat)}
                  </td>

                  {/* ⭐ ACTION BUTTON */}
                  <td>
                    {getEtatLabel(r.etat) !== "Resolue" && (
                      <button
                        className="btn-action"
                        onClick={() =>
                          changeEtat(
                            r.id,
                            getEtatLabel(r.etat) === "Ouverte" ? 2 : 3
                          )
                        }
                      >
                        Passer à{" "}
                        {getEtatLabel(r.etat) === "Ouverte"
                          ? "EnCours"
                          : "Resolue"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
