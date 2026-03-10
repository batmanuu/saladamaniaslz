import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ClientHome from './pages/Client/Home';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminSales from './pages/Admin/Sales';
import Cart from './pages/Client/Cart';
import Login from './pages/Admin/Login';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-text-main max-w-md mx-auto shadow-2xl overflow-hidden relative">
          <Routes>
            <Route path="/" element={<ClientHome />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/vendas" element={<ProtectedRoute><AdminSales /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
