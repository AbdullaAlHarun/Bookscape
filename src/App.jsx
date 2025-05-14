import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/public/Home';
import VenueDetailPage from "./pages/venues/[id]";
import CustomerRoute from './routes/CustomerRoute';
import ManagerRoute from './routes/ManagerRoute';
import './index.css';

function App() {
  return (
    <Routes>
      {/* Public Routes (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Routes with Main Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="/venues/:id" element={<VenueDetailPage />} />

        {/* ✅ Role-based protected routes */}
        <Route
          path="customer"
          element={
            <CustomerRoute>
              <CustomerDashboard />
            </CustomerRoute>
          }
        />
        <Route
          path="manager"
          element={
            <ManagerRoute>
              <ManagerDashboard />
            </ManagerRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
