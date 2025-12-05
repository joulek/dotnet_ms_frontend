import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMyProfile, updateMyProfile } from "../services/api";
import "../styles/profile.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    telephone: "",
    adresse: ""
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);

      setFormData({
        telephone: res.data.telephone || "",
        adresse: res.data.adresse || ""
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de charger le profil");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateMyProfile(formData);
      setMessage("✔ Profil mis à jour !");
      setModalOpen(false);
      loadProfile();
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de la mise à jour");
    }
  };

  if (!profile) return <p className="loading-text">Chargement...</p>;

  const initial = profile.nom?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <>
      <Navbar />

      <div className="profile-container">
        <h1 className="profile-title">Mon Profil</h1>

        {message && <p className="profile-message">{message}</p>}

        <div className="profile-card">

          {/* --- AVATAR + NOM --- */}
          <div className="profile-header">
            <div className="avatar">{initial}</div>

            <div>
              <h2 className="profile-name">{profile.nom} {profile.prenom}</h2>
              <p className="profile-email">{profile.email}</p>
            </div>
          </div>

          {/* --- INFOS ALIGNÉES --- */}
          <div className="profile-grid">
            <div className="profile-block">
              <span className="block-label">Téléphone</span>
              <span className="block-value">{profile.telephone || "-"}</span>
            </div>

            <div className="profile-block">
              <span className="block-label">Adresse</span>
              <span className="block-value">{profile.adresse || "-"}</span>
            </div>

            <div className="profile-block">
              <span className="block-label">Email</span>
              <span className="block-value">{profile.email}</span>
            </div>

            <div className="profile-block">
              <span className="block-label">Créé le</span>
              <span className="block-value">
                {String(profile.dateCreation).substring(0, 10)}
              </span>
            </div>
          </div>

          <button className="btn-edit" onClick={() => setModalOpen(true)}>
            Modifier mon profil
          </button>
        </div>
      </div>

      {/* --- MODAL --- */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Modifier mes informations</h2>

            <form onSubmit={handleSubmit}>
              <label>Téléphone</label>
              <input
                type="text"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />

              <label>Adresse</label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              />

              <div className="modal-actions">
                <button type="submit" className="btn-save">Enregistrer</button>
                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
