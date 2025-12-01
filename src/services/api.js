import axios from "axios";

const API_URL = "https://localhost:7053"; // Gateway Ocelot


const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// 🔐 Ajout auto du token dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
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
   👥 CLIENTS (Admin Only)
================================ */
export const getAllClients = () => api.get("/gateway/clients");
export const createClient = (data) => api.post("/gateway/clients", data);



export default api;
