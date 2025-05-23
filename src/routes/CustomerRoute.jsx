import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CustomerRoute({ children }) {
  const { isAuthenticated, isCustomer, loading } = useAuth();
  const location = useLocation();

 
  if (loading) return null;

 
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

 
  if (!isCustomer) {
    return <Navigate to="/manager" replace />;
  }

  return children;
}
