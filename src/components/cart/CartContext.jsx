import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { data } from "flickity";
import { trackEvent } from '../trackPageView.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  // Cargar productos desde sessionStorage
  const loadCartFromSessionStorage = () => {
    const storedCart = sessionStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  };

  // Guardar el carrito en sessionStorage
  const saveCartToSessionStorage = (cart) => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  };

  const getProducts = async () => {
    await axios
    .get("http://192.168.100.200:4000/products")
    .then(({ data }) => setProducts(data.products));
    console.log(data.products);
  };

  useEffect(() => {
    loadCartFromSessionStorage(); // Carga el carrito al inicio
    getProducts();
  }, []);

  const addItemToCart = (product) => {
    // Comprobar si el producto ya está en el carrito
    const existingProductIndex = cartItems.findIndex(item => item._id === product._id);
    trackEvent('añadir_producto', 'Carrito', 'Añadir Producto', 1);

    if (existingProductIndex > -1) {
      // Si el producto ya está en el carrito, incrementamos la cantidad
      const updatedCart = [...cartItems];
      updatedCart[existingProductIndex].amount += 1; // Aumentar cantidad
      setCartItems(updatedCart);
      saveCartToSessionStorage(updatedCart); // Guarda en sessionStorage
    } else {
      // Si no está en el carrito, añadirlo con amount inicial
      const productWithAmount = { ...product, amount: 1 }; // Inicializa amount en 1
      const updatedCart = [...cartItems, productWithAmount];
      setCartItems(updatedCart);
      saveCartToSessionStorage(updatedCart); // Guarda en sessionStorage
    }
  };

  const editItemToCart = (id, query) => {
    let updatedCart = [...cartItems];
    const index = updatedCart.findIndex(item => item._id === id);
  
    if (query === "del") {
      if (index > -1) {
        // Reducir la cantidad del producto
        updatedCart[index].amount = (updatedCart[index].amount || 1) - 1;
        
        // Si la cantidad es menor a 1, eliminar el producto del carrito
        if (updatedCart[index].amount < 1) {
          updatedCart.splice(index, 1);
        }
      }
    } else if (query === "remove") {
      // Eliminar el producto del carrito completamente
      if (index > -1) {
        updatedCart.splice(index, 1);
      }
    } else { // Para el caso "add"
      if (index > -1) {
        // Si el producto está en el carrito, actualizar la cantidad
        updatedCart[index].amount = (updatedCart[index].amount || 0) + 1;
      }
    }
  
    setCartItems(updatedCart);
    saveCartToSessionStorage(updatedCart); // Guarda en sessionStorage
  };
  
  
  // console.log(cartItems.length);

  
  

  return (
    <CartContext.Provider
      value={{ cartItems, products, addItemToCart, editItemToCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
