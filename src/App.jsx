import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/App.css';
import Home from './home';
import ContactForm from './components/ContactForm';
import Pricing from './components/Pricing';
import ProductDetail from './components/ProductDetail';
import { CartProvider } from './components/cart/CartContext'; // Importa CartProvider aquí

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import Cart from './components/Cart';
import PaymentStatus from './components/PaymentStatus';
import Orders from './components/Orders';
import ProductManager from './components/ProductManager';
import trackPageView from './components/trackPageView';

// Componente para cambiar el título de la página
const RouteWithTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return children;
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Componente para manejar el seguimiento de la vista de página
function TrackPageView() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

function App() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <CartProvider>
      <Router>
        <Header />
        <ScrollToTop />
        <TrackPageView /> {/* Componente que rastrea las vistas de página */}
        <Routes>
          <Route path="/" element={<RouteWithTitle title="Home - cww"><Home /></RouteWithTitle>} />
          <Route path="/contacto" element={<RouteWithTitle title="Contacto - cww"><ContactForm /></RouteWithTitle>} />
          <Route path="/producto/:id" element={<RouteWithTitle title="Detalles del Producto - cww"><ProductDetail /></RouteWithTitle>} />
          <Route path="/precios" element={<RouteWithTitle title="Precios - cww"><Pricing /></RouteWithTitle>} />
          <Route path="/cart" element={<RouteWithTitle title="Carrito - cww"><Cart /></RouteWithTitle>} />
          <Route path="/login" element={<RouteWithTitle title="customer login - cww"><Login /></RouteWithTitle>} />
          <Route path="/register" element={<RouteWithTitle title="Registro - cww"><Register /></RouteWithTitle>} />
          <Route path="/UserProfile" element={<RouteWithTitle title="Perfil de Usuario - cww"><UserProfile /></RouteWithTitle>} />
          <Route path="/Orders" element={<RouteWithTitle title="Orders - cww"><Orders /></RouteWithTitle>} />
          <Route path="/status/:paymentId" element={<RouteWithTitle title="Estado de Pago - cww"><PaymentStatus /></RouteWithTitle>} />
          <Route path="/ProductManager" element={<RouteWithTitle title="Gestión de Productos - cww"><ProductManager /></RouteWithTitle>} />
        </Routes>
        <Footer />
      </Router>
      <span onClick={scrollToTop} className='scrollToTop'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
        </svg>
      </span>
    </CartProvider>
  );
}

export default App;
