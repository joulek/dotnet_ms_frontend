import React, { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/profile.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getMyProfile();
        setProfile(res.data);
      } catch (error) {
        setMessage("❌ Impossible de récupérer votre profil");
        setMessageType("error");
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMyProfile({
        telephone: profile.telephone,
        adresse: profile.adresse,
      });
      setMessage("✔️ Profil mis à jour !");
      setMessageType("success");
    } catch (error) {
      setMessage("⚠ Erreur lors de la mise à jour !");
      setMessageType("error");
    }
  };

  if (!profile) return <p>⏳ Chargement...</p>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2>👤 Mon Profil</h2>

        {message && <p className={`message-box ${messageType}`}>{message}</p>}

        <form onSubmit={handleSubmit} className="profile-form">
          <p><strong>Nom :</strong> {profile.nom} {profile.prenom}</p>
          <p><strong>Email :</strong> {profile.email}</p>
          <p><strong>Date création :</strong> {profile.dateCreation?.substring(0,10)}</p>

          <label>Téléphone :</label>
          <input
            type="text"
            value={profile.telephone || ""}
            onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
          />

          <label>Adresse :</label>
          <input
            type="text"
            value={profile.adresse || ""}
            onChange={(e) => setProfile({ ...profile, adresse: e.target.value })}
          />

          <button type="submit" className="btn-save">💾 Sauvegarder</button>
        </form>
      </div>
    </>
  );
}
