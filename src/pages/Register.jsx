import { useState } from "react";
import api from "../services/api"; 
import "../styles/register.css";
import illustration from "../assets/login.png"; // même image

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post(
                "https://localhost:7053/gateway/auth/register",
                { fullName, email, password }
            );
            window.location.href = "/login"; // Redirection vers login
        } catch (err) {
            setError(err.response?.data || "Erreur lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            {/* Partie Image */}
            <div className="left-section">
                <img src={illustration} alt="Register Illustration" />
            </div>

            {/* Partie Formulaire */}
            <div className="right-section">
                <form className="register-box" onSubmit={handleRegister}>
                    <h2>Créer un compte</h2>

                    <input
                        type="text"
                        placeholder="Nom complet"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Mot de passe (min 6 caractères)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Création..." : "S'inscrire"}
                    </button>

                    <a href="/login" className="switch-to-login">
                        Déjà inscrit ? Se connecter
                    </a>
                </form>
            </div>
        </div>
    );
}
