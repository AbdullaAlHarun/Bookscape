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
import ProtectedRoute from './routes/ProtectedRoute'; 
import NotFound from './pages/public/NotFound';
import ProfileDashboard from './pages/profile/ProfileDashboard';
import CreateVenuePage from "./pages/manager/CreateVenuePage";
import EditVenueForm from "./pages/manager/EditVenueForm";
import VenuesListPage from './pages/venues/VenuesListPage';
import BookVenuePage from "./pages/bookings/BookVenuePage"; 

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
        <Route path="/venues" element={<VenuesListPage />} />
        <Route path="/venues/:id/book" element={<BookVenuePage />} />
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
        <Route
          path="manager/create"
          element={
            <ManagerRoute>
              <CreateVenuePage />
            </ManagerRoute>
          }
        />
        <Route
          path="/manager/edit/:id"
          element={
            <ManagerRoute>
              <EditVenueForm />
            </ManagerRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfileDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ✅ 404 fallback route (MUST be last) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
