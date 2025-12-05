import { useEffect, useState } from "react";
import {
  getAllArticles,
  deleteArticle,
  createArticle,
  updateArticle,
} from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/articles.css";
import { FaBoxOpen, FaTag, FaCalendarAlt, FaShieldAlt, FaAlignLeft } from "react-icons/fa";


export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"


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
      .catch(() => setError("❌ Impossible de charger les articles"));
  };

  /** 🆕 Ajouter */
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

  /** ✏ Modifier */
  const openEditModal = (article) => {
    setEditingArticle(article);
    setFormData({ ...article, imageFile: null });
    setShowModal(true);
  };

  /** 🗑 Supprimer */
  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  /** 📥 Ajouter / Modifier en backend */
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

      setMessage(editingArticle ? "✔ Article modifié avec succès !" : "➕ Article ajouté avec succès !");
      setMessageType("success");

      setShowModal(false);
      loadArticles();
    } catch (error) {
      setMessage("❌ Erreur lors de l'opération !");
      setMessageType("error");
    }
  };
  console.log("🔎 TOKEN ENVOYÉ:", localStorage.getItem("token"));
  console.log("👤 USER ROLE:", user?.role);

  /** 🔴 Supprimer en backend */
  const handleDelete = async () => {
    try {
      await deleteArticle(selectedId);
      setMessage("🗑 Article supprimé avec succès !");
      setMessageType("success");

      setShowDeleteModal(false);
      loadArticles();
    } catch (err) {
      setMessage("❌ Erreur lors de la suppression !");
      setMessageType("error");
    }

  };
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [message]);


  return (
    <>
      <Navbar />
      <div className="articles-container">
        <h1>Liste des Articles</h1>
        {message && (
          <div className={`message-box ${messageType}`}>
            {message}
          </div>
        )}

        {user?.role === "Admin" && (
          <button className="add-button" onClick={openAddModal}>
            Ajouter Article
          </button>
        )}

        {error && <p className="error">{error}</p>}

        <div className="card-grid">
          {articles.map((a) => (
            <div className="article-card" key={a.id}>
              <div className="card-image">
                {a.imageUrl ? (
                  <img src={`https://localhost:7123${a.imageUrl}`} alt={a.nom} />
                ) : (
                  <span className="no-image"><FaBoxOpen /></span>
                )}
              </div>

              <h3>{a.nom}</h3>
              <p className="reference">
                <FaTag className="icon" /> <b>{a.reference}</b>
              </p>

              <p className="desc">
                <FaAlignLeft className="icon" /> {a.description}
              </p>

              <p className="date">
                <FaCalendarAlt className="icon" /> {a.dateAchat?.substring(0, 10)}
              </p>

              <p className={a.estSousGarantie ? "garantie oui" : "garantie non"}>
                <FaShieldAlt className="icon" />
                {a.estSousGarantie ? " Sous garantie" : " Hors garantie"}
              </p>


              {user?.role === "Admin" && (
                <div className="card-actions">
                  <button className="edit-btn" onClick={() => openEditModal(a)}>
                    Modifier
                  </button>
                  <button className="delete-btn" onClick={() => openDeleteModal(a.id)}>
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✏ MODAL AJOUT / MODIF */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h3>{editingArticle ? "✏ Modifier" : "➕ Ajouter"} un Article</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
              <input type="text" placeholder="Référence" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} required />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <input type="date" value={formData.dateAchat} onChange={(e) => setFormData({ ...formData, dateAchat: e.target.value })} required />
              <input type="number" placeholder="Garantie (mois)" value={formData.dureeGarantieMois} onChange={(e) => setFormData({ ...formData, dureeGarantieMois: e.target.value })} required />
              {/* 📂 Zone upload moderne */}
              <div
                className="file-dropzone"
                onClick={() => document.getElementById("file-input").click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  setFormData({ ...formData, imageFile: e.dataTransfer.files[0] });
                }}
              >
                <p>📁 Cliquez ou glissez-déposez une image</p>
                <p className="file-hint">PNG, JPG — Max 2 MB</p>
              </div>

              <input
                id="file-input"
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                onChange={(e) =>
                  setFormData({ ...formData, imageFile: e.target.files[0] })
                }
              />

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}> Annuler</button>
                <button type="submit" className="btn-save">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 MODAL SUPPRESSION */}
      {showDeleteModal && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h3>⚠ Confirmation</h3>
            <p>Voulez-vous vraiment supprimer cet article ?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Annuler</button>
              <button className="btn-delete" onClick={handleDelete}>⚠ Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
