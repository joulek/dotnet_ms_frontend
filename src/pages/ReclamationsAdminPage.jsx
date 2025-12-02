import { useEffect, useState } from "react";
import { getAllReclamations, updateEtatReclamation } from "../services/api";
import Navbar from "../components/Navbar";

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

  // 🔥 Convertir numéro → texte état
  const getEtatLabel = (etat) => {
    switch (etat) {
      case 1: return "Ouverte";
      case 2: return "EnCours";
      case 3: return "Resolue";
      default: return "Inconnu";
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
    return <p>⛔ Accès refusé</p>;

  return (
   <>
  <Navbar />

  <div className="page-content">
    <div className="container">

      <h2>📋 Réclamations</h2>

      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>{success}</p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8">
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
              <td>{r.client?.nom} {r.client?.prenom}</td>
              <td>{r.objet}</td>
              <td>{r.description}</td>
              <td>{r.dateReclamation?.substring(0, 10)}</td>
              <td>{getEtatLabel(r.etat)}</td>

              <td>
                {getEtatLabel(r.etat) !== "Resolue" && (
                  <button
                    onClick={() =>
                      changeEtat(
                        r.id,
                        getEtatLabel(r.etat) === "Ouverte" ? 2 : 3
                      )
                    }
                  >
                    👉 Passer à {getEtatLabel(r.etat) === "Ouverte" ? "EnCours" : "Resolue"}
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