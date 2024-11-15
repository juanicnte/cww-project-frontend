import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { ItemCart } from "./ItemCart";
import axios from "axios";
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import CartContext from "../context/CartContext";
import "./cart.css"

const Cart = () => {
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicializado en true
  const [preferenceId, setPreferenceId] = useState(null);
  const [amount, setAmount] = useState(0); // Estado para la cantidad total
  const [preferenceCreated, setPreferenceCreated] = useState(false); // Bandera de preferencia creada

  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const { editItemToCart } = useContext(CartContext);

  const [productsLength, setProductsLength] = useState(0);
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);

  // Calcular longitud de productos en el carrito
  useEffect(() => {
    setProductsLength(
      cartItems?.reduce((previous, current) => previous + current.amount, 0)
    );
  }, [cartItems]);

  // Obtener el precio total
  const total = cartItems?.reduce(
    (previous, current) => previous + current.amount * current.price,
    0
  );
  

  // Lógica para obtener datos del usuario
  useEffect(() => {
    if (token) {
      axios
        .get(`http://192.168.100.200:4000/user`, {
          headers: {
            token: token,
          },
        })
        .then(({ data }) => setUserData(data._id))
        .catch((error) => console.error(error));
    }
  }, [token]);

  // Inicialización de Mercado Pago solo una vez
  useEffect(() => {
    initMercadoPago('TEST-f84d3d62-5a46-453e-9284-870fa3a52b0b', { locale: "es-AR" });
  }, []);

  // Función para crear la preferencia en el backend
  const createPreference = async (cartItems) => {
    try {
      const itemsToSend = cartItems.map(item => ({
        title: item.name,
        unit_price: item.price,
        quantity: item.amount,
      }));

      console.log(itemsToSend);

      const response = await fetch('http://192.168.100.200:4000/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsToSend }),
      });

      const data = await response.json();
      if (data.id) {
        setPreferenceId(data.id);
        setAmount(total);
        setPreferenceCreated(true); // Marcar preferencia como creada
        console.log("Preference ID creado:", data.id);
      }
    } catch (error) {
      console.error('Error creando la preferencia:', error);
    }
  };

  // Llamar a createPreference cuando cambien los productos en el carrito y no se haya creado una preferencia aún
  useEffect(() => {
    if (productsLength > 0 && !preferenceId && !preferenceCreated) {
      createPreference(cartItems);
    }
  }, [productsLength, cartItems, preferenceCreated]);

  // Configuración de inicialización y personalización del Payment Brick
  const initialization = {
    amount: total,
    preferenceId: preferenceId,
  };

  const customization = {
    paymentMethods: {
      ticket: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: "all",
    },
  };

  // Función onSubmit para manejar la respuesta de Mercado Pago
  const onSubmit = async ({ selectedPaymentMethod, formData }) => {
    formData.items = cartItems.map((item) => ({
      title: item.name,
      unit_price: item.price,
      quantity: item.amount,
      image: item.img,
    }));
    formData.payer.id = userData;
    formData.description = formData.items.map(item => item.title).join(', ');
    console.log(formData);

    try {
      const response = await fetch("http://192.168.100.200:4000/process_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        cartItems.forEach(item => {
          editItemToCart(item._id, "remove");
        });
        navigate(`/status/${data.id}`);
      } else {
        console.error('Error al procesar el pago:', data);
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
    }
  };

  const onError = (error) => {
    console.log(error);
  };

  const onReady = () => {
    if (isLoading) {
      setIsLoading(false);
      console.log('Payment Brick is ready');
    }
  };

  const Loader = ({ size = "2rem" }) => {
    return (
      <div style={{ width: size, height: size, alignSelf: "center", marginTop: "2rem",  }} className='spinner' />
    );
  };

  return (
    <div className="cart">
      {cartItems && (
        <>
          {cartItems.length === 0 ? (
            <section className="cartVacio-section">
              <article className="cartVacio-article">
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 706 706">
                  <title>Empty Cart Saturated</title>
                  <clipPath id="clipBg">
                    <circle id="circle" className="cls-1" cx="353" cy="353" r="320" />
                  </clipPath>
                  <g id="Layer_2" data-name="Layer 2" clipPath="url(#clipBg)">
                    <g id="cartDesaturated">
                      <circle id="circleBg" className="cls-1" cx="353" cy="353" r="320" />
                      <g id="treeSmall">
                        <path className="cls-2" d="M122.89,426.44V429a16.82,16.82,0,0,0-2,.12c-6.28.79-10.46,3.92-12.78,9.59a24.16,24.16,0,0,0-1.73,8.77,5,5,0,0,1-3.08,4.78,24.62,24.62,0,0,0-14.44,16.31c-1.79,6.56-.77,13.26,2.74,17.93,5.55,7.42,18,8.22,23.14,8.22h.73V475l-12.26-6.89a2.5,2.5,0,0,1,1.23-4.68,2.48,2.48,0,0,1,1.23.32l9.8,5.52V454.48a2.5,2.5,0,0,1,5,0v31.69l12.89-7.08a2.49,2.49,0,0,1,3.39,1,2.5,2.5,0,0,1-1,3.4l-15.29,8.39v2.74c1.21.06,2.39.09,3.53.09,17.41,0,27-6.85,27-19.29,0-9.11-11.86-15.09-12-15.15a5,5,0,0,1-2.33-6.66c2.28-4.77,1.43-12.21-2-17.69-2-3.18-5.67-7-11.79-7v-2.51h0" />
                        <path className="cls-3" d="M122.89,424h0a21.21,21.21,0,0,0-2.6.16c-19.58,2.45-18.89,23.48-18.89,23.48-18.38,7.66-23,29.61-13.78,41.86,6.76,9,20.42,10.22,27.14,10.22h.73v-5h-.73c-5.1,0-17.59-.8-23.14-8.22-3.51-4.67-4.53-11.37-2.74-17.93a24.62,24.62,0,0,1,14.44-16.31,5,5,0,0,0,3.08-4.78,24.16,24.16,0,0,1,1.73-8.77c2.32-5.67,6.5-8.8,12.78-9.59a16.82,16.82,0,0,1,2-.12v-5m0,0h0v5c6.12,0,9.79,3.78,11.79,7,3.46,5.48,4.31,12.92,2,17.69a5,5,0,0,0,2.33,6.66c.12.06,12,6,12,15.15,0,12.44-9.59,19.29-27,19.29-1.14,0-2.32,0-3.53-.09v5c1.21.05,2.39.08,3.53.08,24.84,0,32-12.81,32-24.29,0-12.5-14.8-19.65-14.8-19.65,5.34-11.17-1.79-31.81-18.33-31.81" />
                        <path className="cls-3" d="M118,452a2.5,2.5,0,0,0-2.5,2.5v14.83l3.15,1.77a2.5,2.5,0,0,1-1.23,4.68,2.47,2.47,0,0,1-1.22-.32l-.7-.4v44.79a2.5,2.5,0,0,0,5,0v-28l-.18.1a2.49,2.49,0,0,1-3.39-1,2.5,2.5,0,0,1,1-3.4l2.58-1.41V454.48A2.5,2.5,0,0,0,118,452" />
                        <path className="cls-3" d="M104.46,463.47a2.5,2.5,0,0,0-1.23,4.68L115.49,475l.7.4a2.47,2.47,0,0,0,1.22.32,2.5,2.5,0,0,0,1.23-4.68l-3.15-1.77-9.8-5.52a2.48,2.48,0,0,0-1.23-.32" />
                        <path className="cls-3" d="M134.58,478.78a2.47,2.47,0,0,0-1.2.31l-12.89,7.08-2.58,1.41a2.5,2.5,0,0,0,1.2,4.7,2.47,2.47,0,0,0,1.2-.31l.18-.1,15.29-8.39a2.5,2.5,0,0,0-1.2-4.7" />
                      </g>
                      <g id="treeLarge">
                        <path className="cls-2" d="M584.74,373.91v2.5a28.36,28.36,0,0,0-3.41.21c-10.54,1.32-17.89,6.79-21.86,16.25a40.64,40.64,0,0,0-3,15,5,5,0,0,1-3.08,4.77,40.84,40.84,0,0,0-23.94,27.06c-3,11-1.24,22.22,4.68,30.12,9.35,12.46,29.71,13.81,38,13.81.93,0,1.76,0,2.49,0V449.71L555,438.64a2.5,2.5,0,0,1,2.46-4.36L574.65,444V418.68a2.5,2.5,0,1,1,5,0V470l22-12.06a2.46,2.46,0,0,1,1.2-.3,2.5,2.5,0,0,1,1.2,4.69L580.09,475.5a2.78,2.78,0,0,1-.44.19v7.77c2.34.14,4.64.21,6.83.21,16.18,0,28.21-3.62,35.75-10.76C629.5,466,631,457.24,631,451.08c0-15.94-19.9-25.83-20.1-25.93a5,5,0,0,1-2.33-6.65c3.92-8.18,2.53-20.81-3.28-30-2.84-4.5-9.28-12-20.57-12h0v-2.5h0" />
                        <path className="cls-3" d="M584.74,371.41h0a32.89,32.89,0,0,0-4,.25c-30.3,3.79-29.24,36.35-29.24,36.35-28.45,11.86-35.56,45.83-21.34,64.8,10.48,14,31.62,15.81,42,15.81.92,0,1.75,0,2.49,0v-5c-.73,0-1.56,0-2.49,0-8.32,0-28.68-1.35-38-13.81-5.92-7.9-7.67-19.16-4.68-30.12a40.84,40.84,0,0,1,23.94-27.06,5,5,0,0,0,3.08-4.77,40.64,40.64,0,0,1,3-15c4-9.46,11.32-14.93,21.86-16.25a28.36,28.36,0,0,1,3.41-.21v-5m0,0h0v5h0c11.29,0,17.73,7.55,20.57,12,5.81,9.23,7.2,21.86,3.28,30a5,5,0,0,0,2.33,6.65c.2.1,20.1,10,20.1,25.93,0,6.16-1.52,14.95-8.79,21.83-7.54,7.14-19.57,10.76-35.75,10.76-2.19,0-4.49-.07-6.83-.21v5c2.37.13,4.64.2,6.83.2,38.46,0,49.54-19.82,49.54-37.59,0-19.36-22.92-30.42-22.92-30.42,8.27-17.3-2.77-49.25-28.36-49.25" />
                        <path className="cls-3" d="M577.15,416.18a2.5,2.5,0,0,0-2.5,2.5V444l2.84,1.59a2.5,2.5,0,0,1-2.46,4.36l-.38-.21v70.12a2.5,2.5,0,0,0,5,0V475.69a2.5,2.5,0,0,1-2-4.57l2-1.09V418.68a2.5,2.5,0,0,0-2.5-2.5" />
                        <path className="cls-3" d="M556.21,434a2.5,2.5,0,0,0-1.23,4.68l19.67,11.07.38.21a2.48,2.48,0,0,0,1.23.32,2.5,2.5,0,0,0,1.23-4.68L574.65,444l-17.21-9.69a2.48,2.48,0,0,0-1.23-.32" />
                        <path className="cls-3" d="M602.83,457.67a2.46,2.46,0,0,0-1.2.3l-22,12.06-2,1.09a2.5,2.5,0,0,0,2,4.57,2.78,2.78,0,0,0,.44-.19L604,462.36a2.5,2.5,0,0,0-1.2-4.69" />
                      </g>
                      <g id="cart">
                        <path className="cls-4" d="M259.52,405.19H224.19l5.86,26.58h33.31l-3.84-26.58m40.92,0H264.65l3.84,26.58h33.85l-1.9-26.58m40.86,0H305.53l1.9,26.58H341.3V405.19m40.94,0H346.38v26.58h33.88l2-26.58m40.89,0H387.34l-2,26.58H419.2l3.93-26.58m40.88,0H428.26l-3.93,26.58h33.82L464,405.19M252.54,356.88h-39l9.54,43.23h35.71l-6.24-43.23m44.45,0H257.67l6.25,43.23h36.16L297,356.88m44.31,0H302.08l3.09,43.23H341.3V356.88m44.55,0H346.38v43.23h36.24l3.23-43.23m44.42,0H391l-3.23,43.23h36.16l6.39-43.23m44.4,0H435.4L429,400.11h36.12l9.54-43.23M245.55,308.57H202.87l9.54,43.23H251.8l-6.25-43.23m48,0H250.69l6.25,43.23h39.68l-3.09-43.23m47.77,0H298.63l3.09,43.23H341.3V308.57m48.16,0H346.38V351.8h39.85l3.23-43.23m47.94,0H394.56l-3.23,43.23H431l6.38-43.23m47.93,0H442.54l-6.39,43.23h39.64l9.54-43.23M241,276.91h-45.1l4.75,21.55,1.11,5h43.08L241,276.91m50.29,0H246.12L250,303.49h43.21l-1.9-26.58m50,0H296.37l1.9,26.58h43V276.91m50.52,0H346.38v26.58h43.46l2-26.58m50.26,0H396.92l-2,26.58h43.21l3.93-26.58m50.24,0H447.21l-3.92,26.58h43.17l5.86-26.58" />
                        <path className="cls-5" d="M470.26,400.45l-1.05,4.74a2.54,2.54,0,0,0,1.05-4.74m-262.43-45.8a2.36,2.36,0,0,0,.12.54l-.12-.54M491,306.31l-.12.57a2.62,2.62,0,0,0,.12-.57m-294.31-2a2.59,2.59,0,0,0,.9,4.1l-.9-4.1m67.2,95.81-6.25-43.23H297l3.09,43.23H263.92m41.25,0-3.09-43.23H341.3v43.23H305.17m41.21,0V356.88h39.47l-3.23,43.23H346.38m41.34,0L391,356.88h39.32l-6.39,43.23H387.72M256.94,351.8l-6.25-43.23h42.84l3.09,43.23H256.94m44.78,0-3.09-43.23H341.3V351.8H301.72m44.66,0V308.57h43.08l-3.23,43.23H346.38m44.95,0,3.23-43.23H437.4L431,351.8H391.33m55.88-74.89h-5.13l-3.93,26.58H394.94l2-26.58h-5.1l-2,26.58H346.38V276.91H341.3v26.58h-43l-1.9-26.58h-5.1l1.9,26.58H250l-3.84-26.58H241l3.84,26.58H201.74l1.13,5.08h42.68l6.25,43.23H212.41l1.12,5.08h39l6.24,43.23H223.07l1.12,5.08h35.33l3.84,26.58h5.13l-3.84-26.58h35.79l1.9,26.58h5.09l-1.9-26.58H341.3v26.58h5.08V405.19h35.86l-2,26.58h5.1l2-26.58h35.79l-3.93,26.58h5.13l3.93-26.58H464l1.12-5.08H429l6.39-43.23h39.27l1.12-5.08H436.15l6.39-43.23h42.79l1.13-5.08H443.29l3.92-26.58M445,271.83h0m-151.32,0h0" />
                        <path className="cls-6" d="M179.2,238.13H146.27a3,3,0,0,0-3,3v1.51a3,3,0,0,0,3,3H179.2a3,3,0,0,0,3-3v-1.51a3,3,0,0,0-3-3" />
                        <path className="cls-7" d="M447.82,472.65H243.6a3,3,0,0,0-3,3v1.5a3,3,0,0,0,3,3H447.82a3,3,0,0,0,3-3v-1.5a3,3,0,0,0-3-3" />
                        <path className="cls-8" d="M146.27,245.62a3,3,0,0,1-3-3v-1.51a3,3,0,0,1,3-3H179.2a3,3,0,0,1,3,3v1.51a3,3,0,0,1-3,3H146.27m32.93-12.57H146.27a8.09,8.09,0,0,0-8.08,8.07v1.51a8.09,8.09,0,0,0,8.08,8.07H179.2a8,8,0,0,0,5.26-2l3.62,16.4c1.47-1.09,3-2.17,4.49-3.25l-4.79-21.67a2.46,2.46,0,0,0-.85-1.39,8.08,8.08,0,0,0-7.73-5.78" />
                        <path className="cls-9" d="M243.6,480.15a3,3,0,0,1-3-3v-1.5a3,3,0,0,1,3-3H447.82a3,3,0,0,1,3,3v1.5a3,3,0,0,1-3,3H243.6M447.21,276.91h45.11l-5.86,26.58-1.13,5.08-9.54,43.23-1.12,5.08-9.54,43.23L464,405.19l-5.86,26.58H230.05l-5.86-26.58-1.12-5.08-9.54-43.23-1.12-5.08-9.54-43.23-1.13-5.08-1.11-5-4.75-21.55H447.21m-254.64-15c-1.53,1.08-3,2.16-4.49,3.25l8.64,39.16.9,4.1,9.55,43.23.66,3,.12.54,17.58,79.67v0l9.4,42.6a2.47,2.47,0,0,0,.75,1.3,8.09,8.09,0,0,0,7.91,6.45H447.82a8.08,8.08,0,0,0,8.07-8.08v-1.5a8.08,8.08,0,0,0-8.07-8.08H243.6a8,8,0,0,0-5.22,1.93l-7.2-32.65h229a2.55,2.55,0,0,0,2.48-2l6.54-29.67,1.05-4.74,20.65-93.57.12-.57L498,274.92a2.54,2.54,0,0,0-2.48-3.09H194.76l-2.19-9.94" />
                      </g>
                      <g id="horizon">
                        <path className="cls-9" d="M231.52,526.33h-202a2.5,2.5,0,1,0,0,5h202a2.5,2.5,0,0,0,0-5Z" />
                        <path className="cls-9" d="M668.52,526.33h-202a2.5,2.5,0,0,0,0,5h202a2.5,2.5,0,0,0,0-5Z" />
                        <path className="cls-9" d="M395.52,526.33h-92a2.5,2.5,0,0,0,0,5h92a2.5,2.5,0,0,0,0-5" />
                      </g>
                      <g id="pebbles">
                        <path className="cls-10" d="M623.52,560.33h-12a2.5,2.5,0,0,0,0,5h12a2.5,2.5,0,0,0,0-5" />
                        <path className="cls-10" d="M538.52,552.33h-20a2.5,2.5,0,0,0,0,5h20a2.5,2.5,0,0,0,0-5" />
                        <path className="cls-11" d="M164.52,561.33h-20a2.5,2.5,0,1,0,0,5h20a2.5,2.5,0,0,0,0-5" />
                        <path className="cls-11" d="M83.52,547.33h-12a2.5,2.5,0,1,0,0,5h12a2.5,2.5,0,0,0,0-5" />
                      </g>
                      <path id="blink3" className="cls-9" d="M468.9,236a2.46,2.46,0,0,0-1.37.41l-20.77,13.52a2.5,2.5,0,0,0,1.37,4.6,2.43,2.43,0,0,0,1.36-.41l20.77-13.52a2.5,2.5,0,0,0-1.36-4.6" />
                      <path id="blink2" className="cls-9" d="M445.52,218.73a2.49,2.49,0,0,0-2.34,1.62l-8.73,23.2a2.49,2.49,0,0,0,1.46,3.22,2.44,2.44,0,0,0,.88.16,2.49,2.49,0,0,0,2.34-1.62l8.73-23.2a2.51,2.51,0,0,0-1.46-3.22,2.73,2.73,0,0,0-.88-.16" />
                      <path id="blink1" className="cls-9" d="M416.67,217.62a3.07,3.07,0,0,0-.6.07,2.51,2.51,0,0,0-1.83,3l5.92,24.07a2.5,2.5,0,0,0,2.43,1.9,2.46,2.46,0,0,0,.6-.07,2.51,2.51,0,0,0,1.83-3l-5.92-24.07a2.51,2.51,0,0,0-2.43-1.9" />
                      <path id="cloudLarge" className="cls-12" d="M586,103.68c-17.89,0-30.79,20.9-30.79,20.9-1.13-.08-2.22-.11-3.25-.11-24.89,0-20.59,19.87-18.91,25.39a2,2,0,0,0,1.9,1.42l99.26.54h0a2,2,0,0,0,1.8-1.13c10.92-23.37-15.58-24.06-18.76-24.06h-.31C606,109.36,595.3,103.68,586,103.68" />
                      <path id="cloudSmall" className="cls-13" d="M112,145.75c-14.15,0-24.34,16.53-24.34,16.53-.89-.06-1.73-.09-2.54-.09-19.27,0-16.47,15.29-15.09,20.15a2,2,0,0,0,1.93,1.46l77.9,0a2,2,0,0,0,1.84-1.2c8.26-18.19-12.48-18.73-15-18.73h-.24c-8.65-13.66-17.1-18.15-24.48-18.15" />
                      <g id="wheelBack">
                        <path className="cls-7" d="M268.65,537.67a11.29,11.29,0,1,1,11.28-11.29,11.28,11.28,0,0,1-11.28,11.29m5-29a22.8,22.8,0,0,0-22.78,22.78,22.53,22.53,0,0,0,4.38,13.38A22.74,22.74,0,0,0,287,513a22.5,22.5,0,0,0-13.31-4.33" />
                        <path className="cls-5" d="M268.65,515.09a11.29,11.29,0,1,0,11.28,11.29,11.29,11.29,0,0,0-11.28-11.29" />
                        <path className="cls-14" d="M268.67,503.63a22.81,22.81,0,0,0-22.76,22.78c0,.65,0,1.3.08,2a27.91,27.91,0,0,1,24.61-24.64c-.64-.06-1.28-.09-1.93-.09" />
                        <path className="cls-14" d="M268.65,503.63a22.74,22.74,0,0,0-13.36,41.16,22.53,22.53,0,0,1-4.38-13.38,22.8,22.8,0,0,1,22.78-22.78A22.5,22.5,0,0,1,287,513a22.72,22.72,0,0,0-16.4-9.24A27.91,27.91,0,0,0,246,528.36c-.06-.65-.08-1.3-.08-2a22.81,22.81,0,0,1,22.76-22.78h0" />
                        <path className="cls-9" d="M255.29,544.79a22.74,22.74,0,0,1,13.36-41.16h0c.65,0,1.29,0,1.93.09a22.75,22.75,0,1,1-15.31,41.07m13.36-46.24a27.87,27.87,0,0,0-27.84,27.83,28.2,28.2,0,0,0,.9,7,27.83,27.83,0,1,0,27-34.88h0" />
                        <path className="cls-15" d="M241.71,533.43A27.72,27.72,0,0,0,252,548.64l.12.09a27.92,27.92,0,0,1-10.36-15.3m27-34.88h0A27.83,27.83,0,0,1,291.14,510a1.79,1.79,0,0,0-.22-.34,27.65,27.65,0,0,0-22.23-11.12" />
                      </g>
                      <g id="wheelFront">
                        <path className="cls-7" d="M431.34,537.67a11.29,11.29,0,1,1,11.29-11.29,11.29,11.29,0,0,1-11.29,11.29m5-29A22.74,22.74,0,0,0,418,544.79,22.74,22.74,0,0,0,449.7,513a22.51,22.51,0,0,0-13.32-4.33" />
                        <path className="cls-5" d="M431.34,515.09a11.29,11.29,0,1,0,11.29,11.29,11.3,11.3,0,0,0-11.29-11.29" />
                        <path className="cls-14" d="M431.36,503.63a22.82,22.82,0,0,0-22.76,22.78c0,.65,0,1.3.08,2a27.93,27.93,0,0,1,24.62-24.64c-.64-.06-1.29-.09-1.94-.09" />
                        <path className="cls-15" d="M404.35,533.19a27.66,27.66,0,0,0,10.29,15.45.51.51,0,0,0,.13.09,27.86,27.86,0,0,1-10.42-15.54m27-34.64h0A27.84,27.84,0,0,1,453.84,510c-.07-.11-.14-.23-.22-.34a27.65,27.65,0,0,0-22.23-11.12" />
                        <path className="cls-14" d="M431.34,503.63A22.75,22.75,0,0,0,418,544.79,22.75,22.75,0,0,1,449.7,513a22.72,22.72,0,0,0-16.4-9.24,27.93,27.93,0,0,0-24.62,24.64c-.05-.65-.08-1.3-.08-2a22.82,22.82,0,0,1,22.76-22.78h0" />
                        <path className="cls-9" d="M418,544.79a22.75,22.75,0,0,1,13.36-41.16h0c.65,0,1.3,0,1.94.09A22.75,22.75,0,1,1,418,544.79m13.36-46.24A27.84,27.84,0,1,0,453.84,510a27.86,27.86,0,0,0-22.5-11.46h0" />
                      </g>
                    </g>
                  </g>
                </svg>
                <p>Tu carrito está vacío</p>
              </article>
              <button className="seguirComprando-button-cartVacio" onClick={() => navigate("/precios")}>
                Seguir Comprando
              </button>
            </section>
          ) : (
            <div className="productsContainer">
              {cartItems.map((item, i) => (
                <ItemCart key={i} item={item} />
              ))}
              <section className="total">
                <p className="total-title">Total</p>
                <p className="total-price">$ {total}</p>
              </section>
              {token ? (
                preferenceId ? (
                  <div id="paymentBrick_container">
                    <Payment
                      initialization={initialization}
                      customization={customization}
                      onSubmit={onSubmit}
                      onReady={onReady}
                      onError={onError}
                    />
                  </div>
                ) : (
                  <Loader></Loader>
                )
              ) : (
                <div>
                  <p>No estás registrado</p>
                  <p onClick={() => navigate("/login")}>Iniciar Sesión</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
