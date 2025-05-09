import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="p-4">
      <nav className="flex gap-4 mb-4">
        <Link to="/customer">Customer Dashboard</Link>
        <Link to="/manager">Manager Dashboard</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
};

export default MainLayout;
