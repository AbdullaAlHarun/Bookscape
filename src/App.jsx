import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/public/Home';
import './index.css';
import VenueDetailPage from "./pages/venues/[id]"; 


function App() {
  return (
    <Routes>
      {/* Public Auth Route without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* All other routes within layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="customer" element={<CustomerDashboard />} />
        <Route path="manager" element={<ManagerDashboard />} />
        <Route path="home" element={<Home />} />
        <Route path="/venues/:id" element={<VenueDetailPage />} />
        
      </Route>
    </Routes>
  );
}

export default App;
