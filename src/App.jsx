import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './App.css';

import { CartProvider } from './components/context/CartContext'; // Importamos CartProvider

// COMPONENTES
import Home from './components/Home/home';
import ContactForm from './components/Contact/ContactForm';
import Pricing from './components/Products/Pricing';
import ProductDetail from './components/Products/ProductDetail';
import Header from './components/Header&Footer/Header';
import Footer from './components/Header&Footer/Footer';
import Login from './components/Users/Login';
import Register from './components/Users/Register';
import UserProfile from './components/Users/UserProfile';
import Cart from './components/cart/Cart';
import PaymentStatus from './components/Products/PaymentStatus';
import Orders from './components/Users/Orders';
import ProductManager from './components/Users/ProductManager';
import trackPageView from './components/context/trackPageView';

// Componente para cambiar el título de la página
const RouteWithTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return children;
};


const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Función que maneja el evento de scroll
    const handleScroll = () => {
      setShowButton(window.scrollY > 0);
    };

    // Agrega el listener al evento scroll
    window.addEventListener('scroll', handleScroll);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return showButton ? (
    <span onClick={scrollToTop} className='scrollToTop'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
      </svg>
    </span>
  ) : (
    <p>esperando</p>
  );
};

function App() {
  
// Componente para manejar el seguimiento de la vista de página
function TrackPageView() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

  return (
    <CartProvider>
      <Router>
        <Header />
        <main>
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
        </main>
        <Footer />
      </Router>
      <ScrollToTopButton />
    </CartProvider>
  );
}

export default App;
