import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  return (
    <>
       <Toaster position="top-center" />
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
      <Footer /> 
    </>
  );
};

export default MainLayout;
