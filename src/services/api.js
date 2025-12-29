import axios from "axios";

const API_URL = "https://localhost:7053"; // Gateway Ocelot


const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// 🔐 Ajout auto du token dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN USED (localStorage):", token); // 👈 ici
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


/* ============================
   📌 AUTHENTIFICATION
================================ */
export const login = (data) => api.post("/gateway/auth/login", data);
export const register = (data) => api.post("/gateway/auth/register", data);


/* ============================
   📦 ARTICLES (Public + Admin)
================================ */
// 🟢 Public
export const getAllArticles = () => api.get("/gateway/articles");
export const getArticleById = (id) => api.get(`/gateway/articles/${id}`);

// 🔐 Admin
export const createArticle = (data) =>
  api.post("/gateway/articles", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateArticle = (id, data) =>
  api.put(`/gateway/articles/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteArticle = (id) => api.delete(`/gateway/articles/${id}`);


/* ============================
   👥 CLIENTS
================================ */

// 🟣 ADMIN : récupérer tous les clients
export const getAllClients = () => api.get("/gateway/clients");

// 🟣 ADMIN : créer un client
export const createClient = (data) =>
  api.post("/gateway/clients", data);
// 🟡 CLIENT AUTHENTIFIÉ : récupérer SON profil client
export const getClientById = (id) =>
  api.get(`/gateway/clients/${id}`);

// 🟣 ADMIN : modifier un client (si besoin)
export const updateClient = (id, data) =>
  api.put(`/gateway/clients/${id}`, data);
// 🟣 ADMIN : supprimer un client
export const deleteClient = (id) =>
  api.delete(`/gateway/clients/${id}`);




// ⭐ GET profil du client connecté
export const getMyProfile = () =>
  api.get("/gateway/profile/me");

// ⭐ UPDATE profil du client connecté
export const updateMyProfile = (data) =>
  api.put("/gateway/profile/me", data, {
    headers: { "Content-Type": "application/json" },
  });


/* ============================
   🔧 INTERVENTIONS
================================ */
// 🟢 Public
export const getAllInterventions = () => api.get("/gateway/interventions");

// 🔐 Admin ou Technicien
export const createIntervention = (data) => api.post("/gateway/interventions", data);
export const updateIntervention = (id, data) => api.put(`/gateway/interventions/${id}`, data);


/* ============================
   📢 RECLAMATIONS
============================ */
export const getAllReclamations = () => api.get("/gateway/reclamations");

export const createReclamation = (data) =>
  api.post("/gateway/reclamations", data);

export const updateEtatReclamation = (id, nouvelEtat) =>
  api.put(
    `/gateway/reclamations/${id}/etat`,
    JSON.stringify(nouvelEtat),    // envoyer : 2 ou 3
    { headers: { "Content-Type": "application/json" } }
  );


/* ============================
   🛒 PANIER (OrdersAPI)
================================ */

// ⭐ Récupérer le panier du client connecté
export const getMyCart = () =>
  api.get("/gateway/cart");

export const addToCart = (articleId, quantity, unitPrice, articleName) =>
  api.post("/gateway/cart/items", {
    articleId,
    quantity,
    unitPrice,
    articleName
  });



/* ============================
   🧾 COMMANDES (OrdersAPI)
================================ */

// ⭐ Récupérer toutes les commandes du client connecté
export const getMyOrders = () =>
  api.get("/gateway/orders/me");

// ⭐ Créer une commande à partir du panier
export const createOrderFromCart = () =>
  api.post("/gateway/orders/create-from-cart");


export function increaseCartItem(articleId) {
  return api.put(`/gateway/cart/inc/${articleId}`);
}

export function decreaseCartItem(articleId) {
  return api.put(`/gateway/cart/dec/${articleId}`);
}

export default api;
