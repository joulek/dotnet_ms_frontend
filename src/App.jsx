import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";  // ⬅️ IMPORTANT

import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientDashboard from "./pages/ClientDashboard";
import ArticlesPage from "./pages/ArticlesPage";
import InterventionsPage from "./pages/InterventionsPage";
import ReclamationFormPage from "./pages/ReclamationFormPage";
import ReclamationsAdminPage from "./pages/ReclamationsAdminPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";



function App() {
  return (
    <Routes>
      {/* pages sans sidebar */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* pages AVEC sidebar */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/client"
        element={
          <ProtectedRoute>
            <Layout>
              <ClientDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/articles"
        element={
          <Layout>
            <ArticlesPage />
          </Layout>
        }
      />

      <Route
        path="/interventions"
        element={
          <Layout>
            <InterventionsPage />
          </Layout>
        }
      />

      <Route
        path="/reclamation/nouvelle"
        element={
          <Layout>
            <ReclamationFormPage />
          </Layout>
        }
      />

      <Route
        path="/admin/reclamations"
        element={
          <Layout>
            <ReclamationsAdminPage />
          </Layout>
        }
      />

      <Route path="/profile/me" element={<ProfilePage />} />
      <Route
        path="/client/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
