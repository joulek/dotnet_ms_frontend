import React, { useEffect, useState } from "react";
import axios from "axios";
import { getMyOrders } from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/orders.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [articlesMap, setArticlesMap] = useState({});
  const [loading, setLoading] = useState(true);

  /** Charger les commandes du client */
async function loadOrders() {
  const storedOrders =
    JSON.parse(localStorage.getItem("orders")) || [];
  setOrders(storedOrders);
}


  /** Charger tous les articles une seule fois */
  async function loadArticles() {
    try {
      const res = await axios.get("https://localhost:7123/api/Article");

      const map = {};
      res.data.forEach(a => {
        map[a.id] = a.nom;              // ⭐ id -> nom
      });

      setArticlesMap(map);
    } catch (err) {
      console.error("Erreur articles:", err);
    }
  }

  useEffect(() => {
    async function init() {
      setLoading(true);

      await Promise.all([
        loadOrders(),
        loadArticles()
      ]);

      setLoading(false);
    }

    init();
  }, []);

  if (loading) return <div className="orders-loading">⏳ Chargement…</div>;

  return (
    <>
      <Navbar />

      <div className="orders-page">
        <h1 className="orders-title">Mes Commandes</h1>

        {!orders.length && (
          <div className="orders-empty">
            😕 Vous n’avez encore passé aucune commande
          </div>
        )}

        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <h2>Commande #{order.id}</h2>
              <span className="order-date">
                📅 {new Date(order.orderDate).toLocaleDateString()}
              </span>
            </div>

            <div className="order-total">
              Total payé : <b>{order.totalAmount} DT</b>
            </div>

            <div className="order-items">
              {order.items?.map((i, idx) => (
                <div className="order-item" key={idx}>
                  
                  {/* ⭐ affiche le vrai nom de produit */}
                  <span><strong>Articles :</strong> {articlesMap[i.articleId] || `Article ${i.articleId}`}</span>

                  <span><strong>Prix total :</strong> {i.quantity} × {i.unitPrice} DT</span>

                  <b>= {i.quantity * i.unitPrice} DT</b>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
