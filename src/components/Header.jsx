import React, { useEffect, useRef, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import logo from "/img/cww_rosa_png.png"
import "../css/Header.css"
import Cart from './Cart';
import CartContext from "./cart/CartContext";
const token = localStorage.getItem("token");

const Header = () => {
    const navigate = useNavigate();

    const { cartItems } = useContext(CartContext);
    useEffect(() => {
        setProductsLength(
            cartItems?.reduce((previous, current) => previous + current.amount, 0)
        );
    }, [cartItems]);
    const [productsLength, setProductsLength] = useState(0);

    const headerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                headerRef.current.classList.toggle('active', window.scrollY > 0);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    // Función para manejar el click en el botón del menú móvil
    const handleMobileNavClick = () => {
        const buttonRef = document.getElementById('btn');
        const mobileNav = document.querySelector('#mobile-nav');
        const body = document.body;

        if (mobileNav) {
            mobileNav.classList.toggle('active');
            buttonRef.classList.toggle('active');
            // body.classList.toggle('no-scroll');

        }
    };
    // Funcion para abrir submenu de opciones de menu hamburguesa
    const openSubMenu = (event) => {
        event.stopPropagation(); // Evita que el clic en la flechita afecte otros elementos

        const flechita = event.currentTarget; // El ícono clicado
        const menuItem = flechita.parentElement; // El contenedor del ícono
        const abrirCaja = menuItem.nextElementSibling; // El submenú asociado

        if (abrirCaja) {
            abrirCaja.classList.toggle('active');
            flechita.classList.toggle('active');
        }
    };



    return (
        <>
            <header className="header" ref={headerRef}>

                <a className="link-img-container" href="/"><img src={logo} className="img-logo" alt="" /></a>
                <div className='header-btns'>
                    {/* <a className="start-now-btn" href="/contacto">¡Empezá Ahora!</a> */}
                    <Link className="start-now-btn" to="/contacto">¡Empezá Ahora!</Link>
                    <div className='cart-header-container' onClick={() => navigate("/cart")}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#222222"
                            className="size-6 carrito-link-svg-header">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        {productsLength === 0 ? (
                            <></>// <button disabled>En el carrito</button> // Botón deshabilitado si ya está en el carrito
                        ) : (

                            <div className="productsNumber">{productsLength}</div>
                        )}
                    </div>

                    {/*  <!-- menu hamburguesa empieza --> */}
                    <button id="btn" onClick={handleMobileNavClick}>
                        <div className="btn-content" />
                        <div className="btn-content" />
                        <div className="btn-content" />
                    </button>
                </div>
                <nav id="mobile-nav">
                    <section className='container-mobile-nav'>
                        {!token ? (
                            <div className="menu-cervezas container-option" onClick={openSubMenu}>
                                <Link to="/login" onClick={handleMobileNavClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 userLogin">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    <p>Iniciar</p>
                                </Link>
                            </div>
                        ) : (
                            <div className="menu-cervezas container-option" onClick={openSubMenu}>
                                <Link to="/userProfile" onClick={handleMobileNavClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                                    </svg>
                                    <p>Mi Perfil</p>
                                </Link>
                            </div>
                        )}
                        <div className="menu-cervezas container-option" onClick={openSubMenu}>
                            {/* <a href='/'>Inicio</a> */}
                            <Link to="/" onClick={handleMobileNavClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 userLogin">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                Inicio
                            </Link>
                        </div>

                        <div className="menu-cervezas container-option" onClick={openSubMenu}>
                            {/* <a href='/contacto'>Contacto</a> */}
                            <Link to="/contacto" onClick={handleMobileNavClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 userLogin">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                </svg>
                                Contacto
                            </Link>
                        </div>
                        <div className="menu-cervezas container-option" >
                            {/* <a href='/precios'>Servicios</a> */}
                            <Link to="/precios" onClick={handleMobileNavClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 userLogin">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                Servicios
                            </Link>
                            <svg onClick={openSubMenu} className='svg-flechita-nav-sub' viewBox="0 0 18 7.742" xmlns="http://www.w3.org/2000/svg" strokeWidth={2.0}>
                            <path d="M0,.839,6.44,9,0,17.162.818,18,7.743,9.225,7.522,9l.22-.225L.818,0Z" fill="#fff" transform="translate(18) rotate(90)"></path>
                            </svg>
                        </div>
                        <div className="abrir-caja">
                            <li className="cervezas-lista"><a href="/">OPCION 1</a></li>
                            <li className="cervezas-lista"><a href="/">OPCION 2</a></li>
                            <li className="cervezas-lista"><a href="/">OPCION 3</a></li>
                            <li className="cervezas-lista"><a href="/">OPCION 4</a></li>
                            <li className="cervezas-lista"><a href="/">OPCION 5</a></li>
                            <li className="cervezas-lista"><a href="/">OPCION 6</a></li>
                            <li className="cervezas-lista"><a href="/">OPCION 7</a></li>
                            <li className="cervezas-lista"><a href="/">OPCION 8</a></li>
                        </div>
                    </section>
                </nav>
                {/* <!-- menu hamburguesa termina -->*/}


            </header>
        </>
    );
};

export default Header;