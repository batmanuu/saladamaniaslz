import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ClientHome from './pages/Client/Home';
import AdminDashboard from './pages/Admin/Dashboard';
import Cart from './pages/Client/Cart';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-text-main max-w-md mx-auto shadow-2xl overflow-hidden relative">
          <Routes>
            <Route path="/" element={<ClientHome />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
