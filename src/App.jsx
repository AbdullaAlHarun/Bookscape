import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/public/Home';
import NotFound from './pages/public/NotFound';

import VenueDetailPage from "./pages/venues/[id]";
import VenuesListPage from './pages/venues/VenuesListPage';

import CreateVenuePage from "./pages/manager/CreateVenuePage";
import EditVenueForm from "./pages/manager/EditVenueForm";

import BookVenuePage from "./pages/bookings/BookVenuePage";
import BookingConfirmPage from "./pages/bookings/BookingConfirmPage"; 

import ProfileDashboard from './pages/profile/ProfileDashboard';

import CustomerRoute from './routes/CustomerRoute';
import ManagerRoute from './routes/ManagerRoute';
import ProtectedRoute from './routes/ProtectedRoute';

import './index.css';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Routes with layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="/venues/:id" element={<VenueDetailPage />} />
        <Route path="/venues" element={<VenuesListPage />} />

        {/* Protected routes */}
        <Route
          path="customer"
          element={
            <CustomerRoute>
              <CustomerDashboard />
            </CustomerRoute>
          }
        />
        <Route
          path="/venues/:id/book"
          element={
            <CustomerRoute>
              <BookVenuePage />
            </CustomerRoute>
          }
        />
       
       <Route
          path="/bookings/:id/confirm"
          element={
            <CustomerRoute>
              <BookingConfirmPage />
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

      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
