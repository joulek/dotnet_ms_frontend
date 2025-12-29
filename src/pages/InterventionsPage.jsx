import { useEffect, useState } from "react";
import {
  getAllInterventions,
  createIntervention,
  updateIntervention,
  getAllReclamations,
} from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/interventions.css";

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState([]);
  const [reclamations, setReclamations] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    reclamationId: "",
    technicien: user?.fullName || "",
    description: "",
    statut: "En attente",
  });

  /* =============================
     🔄 Chargement des données
  ============================== */

  useEffect(() => {
    loadInterventions();
    loadReclamations();
  }, []);

  const loadInterventions = () => {
    getAllInterventions()
      .then((res) => setInterventions(res.data))
      .catch(() => setError("❌ Impossible de charger les interventions"));
  };

  const loadReclamations = () => {
    getAllReclamations()
      .then((res) => setReclamations(res.data))
      .catch(() => console.log("❌ Erreur chargement réclamations"));
  };

  /* =============================
     🪟 Modals
  ============================== */

  const openAddModal = () => {
    setEditingIntervention(null);
    setFormData({
      reclamationId: "",
      technicien: user?.fullName || "",
      description: "",
      statut: "En attente",
    });
    setShowModal(true);
  };

  const openEditModal = (intervention) => {
    setEditingIntervention(intervention);
    setFormData({
      reclamationId: intervention.reclamationId,
      technicien: intervention.technicien,
      description: intervention.description,
      statut: intervention.statut,
    });
    setShowModal(true);
  };

  /* =============================
     📤 Submit
  ============================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIntervention) {
        await updateIntervention(editingIntervention.id, formData);
      } else {
        await createIntervention(formData);
      }

      setMessage(
        editingIntervention
          ? "✔ Intervention modifiée avec succès !"
          : "➕ Intervention ajoutée !"
      );
      setMessageType("success");
      setShowModal(false);
      loadInterventions();
    } catch (error) {
      setMessage("❌ Erreur lors de l'opération !");
      setMessageType("error");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /* =============================
     🔐 Sécurité
  ============================== */

  if (user?.role !== "Admin" && user?.role !== "Technicien") {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        ⛔ Accès refusé
      </p>
    );
  }

  /* =============================
     🧩 UI
  ============================== */

  return (
    <>
      <Navbar />

      <div className="interventions-container">
        <h1>Liste des interventions</h1>

        {message && (
          <div className={`message-box ${messageType}`}>{message}</div>
        )}

        <button className="add-btn" onClick={openAddModal}>
          Ajouter Intervention
        </button>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Réclamation</th>
                <th>Technicien</th>
                <th>Description</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {interventions.map((i) => (
                <tr key={i.id}>
                  <td>{i.reclamationId}</td>
                  <td>{i.technicien}</td>
                  <td>{i.description}</td>
                  <td>{i.dateIntervention?.substring(0, 10)}</td>
                  <td data-status={i.statut}>{i.statut}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(i)}
                    >
                      ✏
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =============================
          🪟 MODAL
      ============================== */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h3>
              {editingIntervention
                ? "✏ Modifier intervention"
                : "➕ Nouvelle intervention"}
            </h3>

            <form onSubmit={handleSubmit}>
              {/* ✅ DROPDOWN RECLAMATIONS */}
              <select
                value={formData.reclamationId}
                onChange={(e) =>
                  setFormData({ ...formData, reclamationId: e.target.value })
                }
                required
              >
                <option value="">-- Sélectionner une réclamation --</option>

                {reclamations.map((r) => (
                 <option key={r.id} value={r.id}>
  Réclamation #{r.id} – {r.clientName}
</option>

                ))}
              </select>


              <input
                type="text"
                placeholder="Technicien"
                value={formData.technicien}
                onChange={(e) =>
                  setFormData({ ...formData, technicien: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <select
                value={formData.statut}
                onChange={(e) =>
                  setFormData({ ...formData, statut: e.target.value })
                }
              >
                <option>En attente</option>
                <option>En cours</option>
                <option>Terminée</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-save">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
