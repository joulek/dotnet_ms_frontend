import { useState } from "react";
import api from "../services/api";
import "../styles/login.css";
import illustration from "../assets/login.png";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/gateway/auth/login", { email, password });

            console.log("%c🔑 LOGIN SUCCESS", "color: green; font-weight: bold;", res.data);

            // 🧼 Nettoyage du token : retire \n, \r, espaces
            let cleanToken = res.data.token;
            cleanToken = cleanToken.replace(/(\r\n|\n|\r)/gm, "").trim();

            // Sauvegarde propre
            localStorage.setItem("token", cleanToken);
            localStorage.setItem("user", JSON.stringify(res.data));

            // 🔀 Redirection selon rôle
            if (res.data.role === "Admin") {
                window.location.replace("/dashboard/admin");
            } else {
                window.location.replace("/dashboard/client");
            }
        } catch (err) {
            console.log("%c❌ ERREUR LOGIN", "color: red; font-weight: bold;", err.response);
            setError(err.response?.data || "Erreur lors de la connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            {/* Partie Image */}
            <div className="left-section">
                <img src={illustration} alt="Login Illustration" />
            </div>

            {/* Partie formulaire */}
            <div className="right-section">
                <form className="login-box" onSubmit={handleLogin}>
                    <h2>Se connecter</h2>

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Connexion..." : "Login"}
                    </button>

                    <a href="/register" className="forgot">Pas de compte ?</a>
                </form>
            </div>
        </div>
    );
}
