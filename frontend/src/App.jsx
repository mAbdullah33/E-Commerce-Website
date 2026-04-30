import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import HotSalePage from './pages/HotSalePage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import OrderDetailPage from './pages/OrderDetailPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ProductForm from './pages/admin/ProductForm';
import ManageOrders from './pages/admin/ManageOrders';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-white">
              <Navbar />
              <main>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products/pvc-panels" element={<ProductsPage category="PVC Panel" />} />
                  <Route path="/products/hard-panels" element={<ProductsPage category="Hard Panel" />} />
                  <Route path="/hot-sale" element={<HotSalePage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<LoginPage isRegister={true} />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminLayout><AdminDashboard /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminLayout><ManageProducts /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products/new" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminLayout><ProductForm /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products/edit/:id" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminLayout><ProductForm /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminLayout><ManageOrders /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminLayout><AdminSettings /></AdminLayout>
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" toastOptions={{
              style: { fontFamily: "'Outfit', sans-serif", borderRadius: '8px' }
            }} />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}