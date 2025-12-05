import { useEffect, useState } from "react";
import { getAllClients, createClient } from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/clients.css";  // ⭐ IMPORTANT

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token") && user?.role === "Admin") {
      loadClients();
    }
  }, []);

  const loadClients = () => {
    getAllClients()
      .then((res) => setClients(res.data))
      .catch(() => setError("❌ Impossible de charger les clients."));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClient(formData);
      alert("✔ Client ajouté avec succès !");
      setShowModal(false);
      loadClients();
    } catch {
      alert("❌ Erreur lors de l'ajout !");
    }
  };

  if (user?.role !== "Admin") {
    return <p style={{ textAlign: "center", marginTop: "30px" }}>⛔ Accès refusé</p>;
  }

  return (
    <>
      <Navbar />

      <div className="clients-container">
        <h1>Liste des clients</h1>

        <button className="add-client-btn" onClick={() => setShowModal(true)}>
          Ajouter un Client
        </button>

        {error && <p className="error-msg">{error}</p>}

        <div className="table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Date création</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.nom}</td>
                  <td>{c.prenom}</td>
                  <td>{c.email}</td>
                  <td>{c.telephone}</td>
                  <td>{c.adresse}</td>
                  <td>{String(c.dateCreation).substring(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📌 MODAL AJOUT CLIENT */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h3>➕ Ajouter un Client</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nom"
                required
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
              <input
                type="text"
                placeholder="Prénom"
                required
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Téléphone"
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Adresse"
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              />

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
