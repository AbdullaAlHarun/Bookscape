import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import Login from './pages/auth/Login';

function App() {
  return (
    <Routes>
      {/* Public Auth Route without layout */}
      <Route path="/login" element={<Login />} />

      {/* All other routes within layout */}
      <Route path="/" element={<MainLayout />}>
        <Route path="customer" element={<CustomerDashboard />} />
        <Route path="manager" element={<ManagerDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
