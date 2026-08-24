import { Routes, Route } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import SportsWear from "./pages/SportsWear"
import Electronics from "./pages/Electronics"
import Appliances from "./pages/Appliances"
import Mobiles from "./pages/Mobiles"
import Profile from "./pages/Profile"
import Cart from "./pages/Cart"
import Dashboard from "./pages/Dashboard"
import ProductPage from "./pages/ProductPage"
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedAdminRoute from "../ProtectedRoute/Admin-Protected-Route"
import Orders from "./pages/Orders"
import Checkout from "./pages/Checkout"
import { ScrollToTop } from "./components/ScrollToTop"


function App() {


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sportswear" element={<SportsWear />} />
        <Route path="/electronics" element={<Electronics />} />
        <Route path="/appliances" element={<Appliances />} />
        <Route path="/mobiles" element={<Mobiles />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
