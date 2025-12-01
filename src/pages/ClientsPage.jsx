import { useEffect, useState } from "react";
import { getAllClients, createClient } from "../services/api";
import Navbar from "../components/Navbar";

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
  // 🔍 LOG USER CONNECTÉ
  console.log("%c👤 USER CONNECTÉ", "color: blue; font-weight: bold;");
  console.log(user);
  useEffect(() => {
    if (user?.role !== "Admin") return; // sécurité front
    loadClients();
  }, []);
  const loadClients = () => {
    console.log("%c📡 Requête → GET /gateway/clients", "color: orange");

    getAllClients()
      .then((res) => {
        console.log("%c📥 Clients chargés avec succès", "color: green");
        console.log(res.data);
        setClients(res.data);
      })
      .catch((err) => {
        console.log("%c🚨 Échec chargement clients", "color: red", err.response);
        setError("Impossible de charger les clients");
      });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClient(formData);
      alert("👤 Client ajouté avec succès !");
      setShowModal(false);
      loadClients();
    } catch (err) {
      alert("❌ Erreur lors de l'ajout !");
    }
  };

  if (user?.role !== "Admin") {
    return <p style={{ textAlign: "center", marginTop: "30px" }}>⛔ Accès refusé</p>;
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>👥 Liste des Clients</h2>

        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "8px 14px",
            background: "#4caf50",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "15px",
          }}
        >
          ➕ Ajouter un Client
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <table style={{ width: "100%" }} border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
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
                <td>{c.id}</td>
                <td>{c.nom}</td>
                <td>{c.prenom}</td>
                <td>{c.email}</td>
                <td>{c.telephone}</td>
                <td>{c.adresse}</td>
                <td>{c.dateCreation?.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📌 MODAL AJOUT CLIENT */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>➕ Ajouter un Client</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Nom" onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
              <input type="text" placeholder="Prénom" onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} required />
              <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <input type="text" placeholder="Téléphone" onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
              <input type="text" placeholder="Adresse" onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />

              <div style={{ textAlign: "right", marginTop: "10px" }}>
                <button onClick={() => setShowModal(false)} type="button" style={{ marginRight: "10px", background: "#555" }}>
                  ❌ Annuler
                </button>
                <button type="submit" style={{ background: "#007bff" }}>
                  💾 Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* 🌙 Modal style */
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  width: "380px",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
};
