import { useEffect, useState } from "react";
import {
  getAllArticles,
  deleteArticle,
  createArticle,
  updateArticle,
  addToCart,
} from "../services/api";

import Navbar from "../components/Navbar";
import "../styles/articles.css";

import {
  FaBoxOpen,
  FaTag,
  FaCalendarAlt,
  FaShieldAlt,
  FaAlignLeft,
} from "react-icons/fa";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);

  const [formData, setFormData] = useState({
    nom: "",
    reference: "",
    description: "",
    dateAchat: "",
    dureeGarantieMois: "",
    quantiteStock: "",
    prixUnitaire: "",
    imageFile: null,
  });

  // ---------- CHARGEMENT ----------
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    getAllArticles()
      .then((res) => setArticles(res.data))
      .catch(() => setError("❌ Impossible de charger les articles"));
  };

  // ---------- GESTION DES MESSAGES ----------
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ---------- AJOUT AU PANIER ----------
async function handleAddToCart(article) {
  try {
    if (article.quantiteStock <= 0) {
      setMessage("❌ Cet article est en rupture de stock !");
      setMessageType("error");
      return;
    }

    await addToCart(article.id, 1, article.prixUnitaire);

    // 🔥 ACTUALISER LE STOCK APRÈS AJOUT PANIER !
    loadArticles();

    setMessage("➕ Article ajouté au panier !");
    setMessageType("success");
  } catch (err) {
    if (err?.response?.data) {
      setMessage(`❌ ${err.response.data}`);
    } else {
      setMessage("❌ Impossible d'ajouter au panier !");
    }
    setMessageType("error");
  }
}


  // ---------- OUVERTURE MODAL ----------
  const openAddModal = () => {
    setEditingArticle(null);
    setFormData({
      nom: "",
      reference: "",
      description: "",
      dateAchat: "",
      dureeGarantieMois: "",
      quantiteStock: "",
      prixUnitaire: "",
      imageFile: null,
    });
    setShowModal(true);
  };

  const openEditModal = (article) => {
    setEditingArticle(article);
    setFormData({ ...article, imageFile: null });
    setShowModal(true);
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  // ---------- VALIDATION FORM ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });

    try {
      if (editingArticle)
        await updateArticle(editingArticle.id, data);
      else
        await createArticle(data);

      setMessage("✔ Opération validée !");
      setMessageType("success");

      setShowModal(false);
      loadArticles();
    } catch {
      setMessage("❌ Erreur lors de l'opération !");
      setMessageType("error");
    }
  };

  // ---------- SUPPRESSION ----------
  const handleDelete = async () => {
    try {
      await deleteArticle(selectedId);
      setMessage("🗑 Article supprimé !");
      setMessageType("success");
      setShowDeleteModal(false);
      loadArticles();
    } catch {
      setMessage("❌ Erreur lors de la suppression !");
      setMessageType("error");
    }
  };

  // =======================================================
  // ====================== RETURN =========================
  // =======================================================

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
              {/* IMAGE */}
              <div className="card-image">
                {a.imageUrl ? (
                  <img
                    src={`https://localhost:7123${a.imageUrl}`}
                    alt={a.nom}
                  />
                ) : (
                  <span className="no-image"><FaBoxOpen /></span>
                )}
              </div>

              <h3>{a.nom}</h3>

              {/* PRIX */}
              <p className="price">
                💰 Prix : <b>{a.prixUnitaire} DT</b>
              </p>

              <p className="reference">
                <FaTag className="icon" /> <b>{a.reference}</b>
              </p>

              <p className="desc">
                <FaAlignLeft className="icon" /> {a.description}
              </p>

              <p className="date">
                <FaCalendarAlt className="icon" /> {a.dateAchat?.substring(0, 10)}
              </p>

              <p className="stock">
                Stock : {a.quantiteStock ?? 0}
              </p>

              {/* CLIENT BUTTON */}
              {user?.role === "Client" && (
                a.quantiteStock > 0 ? (
                  <button
                    className="cart-btn"
                    onClick={() => handleAddToCart(a)}
                  >
                    Ajouter au panier
                  </button>
                ) : (
                  <button className="cart-btn disabled" disabled>
                    ❌ Rupture de stock
                  </button>
                )
              )}

              {/* ADMIN BUTTONS */}
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

      {/* MODAL AJOUT / MODIF */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h3>{editingArticle ? "✏ Modifier" : "➕ Ajouter"} un Article</h3>

            <form onSubmit={handleSubmit}>

              {/* NOM */}
              <label>Nom de l'article</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />

              {/* RÉFÉRENCE */}
              <label>Référence</label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                required
              />

              {/* DESCRIPTION */}
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              {/* DATE ACHAT */}
              <label>Date d'achat</label>
              <input
                type="date"
                value={formData.dateAchat}
                onChange={(e) => setFormData({ ...formData, dateAchat: e.target.value })}
                required
              />

              {/* GARANTIE */}
              <label>Durée de garantie (mois)</label>
              <input
                type="number"
                value={formData.dureeGarantieMois}
                onChange={(e) => setFormData({ ...formData, dureeGarantieMois: e.target.value })}
                required
              />

              {/* STOCK */}
              <label>Quantité en stock</label>
              <input
                type="number"
                value={formData.quantiteStock}
                onChange={(e) => setFormData({ ...formData, quantiteStock: e.target.value })}
                required
              />

              {/* ⭐ PRIX ⭐ */}
              <label>Prix unitaire (DT)</label>
              <input
                type="number"
                step="0.01"
                value={formData.prixUnitaire}
                onChange={(e) => setFormData({ ...formData, prixUnitaire: e.target.value })}
                required
              />

              {/* IMAGE */}
              <label>Image du produit</label>
              <input
                id="file-input"
                type="file"
                accept="image/png, image/jpeg"
                hidden
                onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
              />

              <div
                className="file-dropzone"
                onClick={() => document.getElementById("file-input").click()}
              >
                📁 Cliquez ou glissez une image
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
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

      {/* MODAL SUPPRESSION */}
      {showDeleteModal && (
        <div className="modalOverlay">
          <div className="modalBox">
            <h3>⚠ Confirmation</h3>
            <p>Voulez-vous vraiment supprimer cet article ?</p>

            <div className="modal-actions">
              <button className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>

              <button className="btn-delete"
                onClick={handleDelete}
              >
                ⚠ Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
