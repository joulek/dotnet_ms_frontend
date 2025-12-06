import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/cart.css";
import { useNavigate } from "react-router-dom";
import { getMyCart } from "../services/api";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [articlesMap, setArticlesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkout, setCheckout] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");


  // ⭐ Modal Payment
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("visa");

  const [customerInfo, setCustomerInfo] = useState({
    fullname: "",
    address: "",
    phone: "",
  });

  // ======================= API =======================
  async function reloadCart() {
    try {
      const res = await getMyCart();
      setCart(res.data);
    } catch {
      console.error("Erreur panier");
    }
  }

  async function loadCart() {
    try {
      const res = await getMyCart();
      setCart(res.data);
    } catch {
      console.error("Erreur panier");
    }
  }

  async function loadArticles() {
    try {
      const res = await axios.get("https://localhost:7123/api/Article");

      const map = {};
      res.data.forEach((a) => {
        map[a.id] = {
          nom: a.nom,
          reference: a.reference,
          image: a.imageUrl
            ? `https://localhost:7123${a.imageUrl}`
            : "/placeholder.png",
        };
      });

      setArticlesMap(map);
    } catch (err) {
      console.error("Erreur articles:", err);
    }
  }

  async function increaseQuantity(articleId) {
    try {
      await axios.put(
        `https://localhost:7053/gateway/cart/inc/${articleId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      reloadCart();
    } catch {
      alert("Erreur lors de l'augmentation");
    }
  }

  async function decreaseQuantity(articleId) {
    try {
      await axios.put(
        `https://localhost:7053/gateway/cart/dec/${articleId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      reloadCart();
    } catch {
      alert("Erreur lors de la diminution");
    }
  }

  // ======================= CHECKOUT =======================
  async function handleCheckout() {
    setCheckout(true);

    try {
      await axios.post(
        "https://localhost:7053/gateway/orders/create-from-cart",
        {
          fullname: customerInfo.fullname,
          address: customerInfo.address,
          phone: customerInfo.phone,
          paymentMethod: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage("🎉 Votre commande a été validée avec succès !");


      // ⛔ vider panier
      reloadCart();

      // ⭐⭐ RECHARGER PAGE ARTICLES ⭐⭐
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (err) {
      alert("Erreur lors du paiement");
    } finally {
      setCheckout(false);
    }
  }


  // ======================= INIT =======================
  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([loadCart(), loadArticles()]);
      setLoading(false);
    }
    init();
  }, []);

  if (loading) return <div className="cart-loading">Chargement…</div>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="page-content">
          <h1 className="shop-title">Mon Panier</h1>
          <p style={{ fontSize: 18, padding: 20, textAlign: "center" }}>🛒 Votre panier est vide</p>
        </div>
      </>
    );
  }

  const total = cart.items.reduce(
    (acc, i) => acc + i.unitPrice * i.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <div className="page-content">
        <h1 className="shop-title">Mon Panier</h1>
        {successMessage && (
          <div className="cart-success">
            {successMessage}
          </div>
        )}

        <div className="shop-container">

          {/* ================= LEFT ================= */}
          <div className="shop-left">
            <div className="shop-header">
              <span>Produit</span>
              <span>Quantité</span>
              <span>Prix</span>
            </div>

            {cart.items.map((item, idx) => (
              <div className="shop-row" key={idx}>
                <div className="shop-product">
                  <div
                    className="shop-product-img"
                    style={{
                      backgroundImage: `url(${articlesMap[item.articleId]?.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>

                  <div>
                    <b>{articlesMap[item.articleId]?.nom}</b>
                    <p style={{ fontSize: 13, color: "#666" }}>
                      {articlesMap[item.articleId]?.reference}
                    </p>
                  </div>
                </div>

                <div className="shop-qty">
                  <button onClick={() => decreaseQuantity(item.articleId)}>–</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.articleId)}>+</button>
                </div>

                <div className="shop-price">
                  <b>{item.unitPrice * item.quantity} DT</b>
                  <small style={{ color: "#777" }}>
                    {item.unitPrice} DT / unité
                  </small>
                </div>
              </div>
            ))}

            <button
              className="shop-back-btn"
              onClick={() => navigate("/articles")}
            >
              Continuer vos achats
            </button>
          </div>

          {/* ================= RIGHT CARD ================= */}
          <div className="shop-right">

            {/* Coupon */}
            <div className="shop-coupon-box">
              <p>Avez-vous un coupon ?</p>
              <div className="shop-coupon-inputs">
                <input placeholder="Code coupon" />
                <button>Appliquer</button>
              </div>
            </div>

            {/* Résumé */}
            <div className="shop-summary-card">
              <div className="sum-row">
                <span>Prix total :</span>
                <b>{total} DT</b>
              </div>

              <div className="sum-row">
                <span>Réduction :</span>
                <b>0 DT</b>
              </div>

              <hr />

              <div className="sum-total">
                <span>Total :</span>
                <b>{total} DT</b>
              </div>

              <button
                className="sum-btn"
                onClick={() => setShowModal(true)}
              >
                Valider l'achat
              </button>

              <div className="sum-payment">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Mastercard.png" alt="" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="" />
              </div>
            </div>

            {/* Livraison */}
            <div className="shop-delivery">
              🚚 Livraison gratuite sous 1–2 semaines
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Finaliser le paiement</h2>

            <div className="modal-form">
              <input
                type="text"
                placeholder="Nom complet"
                value={customerInfo.fullname}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, fullname: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Adresse de livraison"
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, address: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Numéro de téléphone"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
              />

              <div className="modal-payments">
                <label>
                  <input
                    type="radio"
                    name="pay"
                    value="visa"
                    checked={paymentMethod === "visa"}
                    onChange={() => setPaymentMethod("visa")}
                  />{" "}
                  Visa / Mastercard
                </label>

                <label>
                  <input
                    type="radio"
                    name="pay"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                  />{" "}
                  PayPal
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="modal-confirm-btn"
                onClick={handleCheckout}
              >
                {checkout ? "Traitement..." : "Confirmer le paiement"}
              </button>

              <button
                className="modal-cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
}
