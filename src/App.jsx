import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login"; 
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientDashboard from "./pages/ClientDashboard";  
import ArticlesPage from "./pages/ArticlesPage";
import ClientsPage from "./pages/ClientsPage";
import InterventionsPage from "./pages/InterventionsPage";
import ReclamationFormPage from "./pages/ReclamationFormPage";
import ReclamationsAdminPage from "./pages/ReclamationsAdminPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      {/* Redirection par défaut vers login */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Page Login */}
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />
<Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
   
   <Route
        path="/dashboard/client"
        element={
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
{/* 🔓 Public - articles */}
        <Route path="/articles" element={<ArticlesPage />} />

        <Route path="/interventions" element={<InterventionsPage />} />
        <Route path="/reclamation/nouvelle" element={<ReclamationFormPage />} />
<Route path="/admin/reclamations" element={<ReclamationsAdminPage />} />
<Route path="/profil" element={<ProfilePage />} />


<Route path="/clients" element={
  <ProtectedRoute>
    <ClientsPage />
  </ProtectedRoute>
} />

    </Routes>
  );
}

export default App;
