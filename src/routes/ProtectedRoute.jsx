
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ⏳ Wait until localStorage is checked
  if (loading) return null; 
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
