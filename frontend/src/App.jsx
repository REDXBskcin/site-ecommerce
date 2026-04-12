/**
 * App.jsx – Tech Store (BTS SIO)
 *
 * Point d'entrée des routes React.
 * Chaque <Route> correspond à une URL de l'application.
 *
 * Routes publiques : /, /product/:id, /panier, /login, /register,
 *                    /verify-email, /forgot-password, /reset-password
 * Routes protégées (connecté) : /mon-compte, /my-orders, /wishlist
 * Routes admin : /admin, /admin/produits, /admin/commandes, /admin/utilisateurs
 */
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import ProductDetailPage from './pages/ProductDetailPage'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import WishlistPage from './pages/WishlistPage'
import NotFoundPage from './pages/NotFoundPage'
import Cart from './pages/Cart'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'
import MyOrdersPage from './pages/MyOrdersPage'

function App() {
  return (
    // Layout principal : header + footer communs à toutes les pages publiques
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/mon-compte" element={<ProfilePage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="produits" element={<AdminProducts />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="utilisateurs" element={<AdminUsers />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
