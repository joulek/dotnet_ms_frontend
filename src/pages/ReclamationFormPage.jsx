import { useState } from "react";
import { createReclamation } from "../services/api";
import Navbar from "../components/Navbar";
import { FaEnvelopeOpenText } from "react-icons/fa"; // icône titre
import "../styles/reclamation.css"; // CSS externe

export default function ReclamationFormPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({ objet: "", description: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  if (!user) return <p>⛔ Veuillez vous connecter</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReclamation({ ...formData, clientId: user.id });
      setMessage("📨 Réclamation envoyée avec succès !");
      setMessageType("success");
      setFormData({ objet: "", description: "" });
    } catch (err) {
      setMessage("❌ Erreur lors de l'envoi !");
      setMessageType("error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="reclamation-container">
        <h2 className="reclamation-title">
          <FaEnvelopeOpenText className="title-icon" /> Nouvelle Réclamation
        </h2>

        {message && (
          <p className={`message-box ${messageType}`}>{message}</p>
        )}

        <form onSubmit={handleSubmit} className="reclamation-form">
          <input
            type="text"
            placeholder="Objet"
            value={formData.objet}
            onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
            required
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          <button type="submit" className="btn-submit">
            📬 Envoyer
          </button>
        </form>
      </div>
    </>
  );
}
