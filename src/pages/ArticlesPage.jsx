import { useEffect, useState } from "react";
import {
  getAllArticles,
  deleteArticle,
  createArticle,
  updateArticle,
} from "../services/api";
import Navbar from "../components/Navbar";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    nom: "",
    reference: "",
    description: "",
    dateAchat: "",
    dureeGarantieMois: "",
    imageFile: null,
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    getAllArticles()
      .then((res) => setArticles(res.data))
      .catch(() => setError("Impossible de charger les articles"));
  };

  /** 🎯 Ouvrir Modal Ajouter */
  const openAddModal = () => {
    setEditingArticle(null);
    setFormData({
      nom: "",
      reference: "",
      description: "",
      dateAchat: "",
      dureeGarantieMois: "",
      imageFile: null,
    });
    setShowModal(true);
  };

  /** ✏ Ouvrir Modal Modifier */
  const openEditModal = (article) => {
    setEditingArticle(article);
    setFormData({ ...article, imageFile: null });
    setShowModal(true);
  };

  /** ❗ Ouvrir Modal Supprimer */
  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  /** 📥 Ajouter / Modifier */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });

    try {
      editingArticle
        ? await updateArticle(editingArticle.id, data)
        : await createArticle(data);

      alert(editingArticle ? "✔ Modifié avec succès !" : "➕ Ajouté avec succès !");
      setShowModal(false);
      loadArticles();
    } catch (error) {
      alert("❌ Erreur!");
    }
  };

  /** 🗑 Supprimer */
  const handleDelete = async () => {
    try {
      await deleteArticle(selectedId);
      alert("🗑 Supprimé avec succès!");
      setShowDeleteModal(false);
      loadArticles();
    } catch (err) {
      alert("❌ Erreur");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>📦 Liste des Articles</h2>

        {user?.role === "Admin" && (
          <button
            onClick={openAddModal}
            style={{
              padding: "8px 14px",
              background: "#4caf50",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "15px",
            }}
          >
            ➕ Ajouter un Article
          </button>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <table style={{ width: "100%" }} border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Référence</th>
              <th>Description</th>
              <th>Date Achat</th>
              <th>Garantie</th>
              <th>Image</th>
              {user?.role === "Admin" && <th>🛠 Actions</th>}
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nom}</td>
                <td>{a.reference}</td>
                <td>{a.description}</td>
                <td>{a.dateAchat?.substring(0, 10)}</td>
                <td>{a.estSousGarantie ? "✔ Oui" : "❌ Non"}</td>
                <td>
                  {a.imageUrl ? (
                    <img
                      src={`https://localhost:7123${a.imageUrl}`}
                      alt={a.nom}
                      width="60"
                      style={{ borderRadius: "6px" }}
                    />
                  ) : (
                    "❌"
                  )}
                </td>
                {user?.role === "Admin" && (
                  <td>
                    <button
                      onClick={() => openEditModal(a)}
                      style={{
                        background: "#ffaa00",
                        color: "white",
                        borderRadius: "6px",
                        marginRight: "5px",
                      }}
                    >
                      ✏ Modifier
                    </button>
                    <button
                      onClick={() => openDeleteModal(a.id)}
                      style={{
                        background: "#ff4d4f",
                        color: "white",
                        borderRadius: "6px",
                      }}
                    >
                      🗑 Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📌 MODAL AJOUT / MODIF */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>{editingArticle ? "✏ Modifier" : "➕ Ajouter"} un Article</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
              <input type="text" placeholder="Référence" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} required />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <input type="date" value={formData.dateAchat} onChange={(e) => setFormData({ ...formData, dateAchat: e.target.value })} required />
              <input type="number" placeholder="Garantie (mois)" value={formData.dureeGarantieMois} onChange={(e) => setFormData({ ...formData, dureeGarantieMois: e.target.value })} required />
              <input type="file" onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })} />

              <div style={{ textAlign: "right", marginTop: "10px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ marginRight: "10px", background: "#555" }}>
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

      {/* 🔴 MODAL SUPPRESSION */}
      {showDeleteModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>⚠ Confirmation</h3>
            <p>Voulez-vous vraiment supprimer cet article ?</p>
            <div style={{ textAlign: "right" }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ marginRight: "10px", background: "#555" }}>
                Annuler
              </button>
              <button onClick={handleDelete} style={{ background: "#ff4d4f" }}>
                ⚠ Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* 🎨 MODAL STYLES */
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
  width: "400px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
};

