import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ManagerRoute({ children }) {
  const { isAuthenticated, isVenueManager, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isVenueManager) return <Navigate to="/customer" replace />;

  return children;
}
