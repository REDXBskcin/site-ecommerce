/**
 * Composant racine – BTS SIO
 * Définit toutes les routes de l'application.
 * - Layout : pages publiques (accueil, détail produit, panier, login, register)
 * - ProtectedRoute : panier, mon-compte, my-orders (redirection /login si non connecté)
 * - AdminLayout + AdminRoute : dashboard admin (redirection / si non admin)
 * - NotFoundPage : toute URL inconnue
 */
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import ProductDetailPage from './pages/ProductDetailPage'
import Cart from './pages/Cart'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'
import MyOrdersPage from './pages/MyOrdersPage'
import NotFoundPage from './pages/NotFoundPage'
import WishlistPage from './pages/WishlistPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/liste-de-souhaits" element={<WishlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/panier" element={<Cart />} />
          <Route path="/mon-compte" element={<ProfilePage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Route>
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="produits" element={<AdminProducts />} />
          <Route path="utilisateurs" element={<AdminUsers />} />
          <Route path="commandes" element={<AdminOrders />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
