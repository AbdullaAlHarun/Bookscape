import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="customer" element={<CustomerDashboard />} />
        <Route path="manager" element={<ManagerDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
