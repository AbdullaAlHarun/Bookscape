import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CustomerRoute({ children }) {
  const { isAuthenticated, isCustomer, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isCustomer) return <Navigate to="/manager" replace />;

  return children;
}
