import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Orders from './Orders';

import '../css/App.css'
import { article, main } from "framer-motion/client";




const UserProfile = () => {
  const [usuario, setUsuario] = useState(null); // Estado para guardar los datos del usuario
  const token = localStorage.getItem("token");
  

  const [titulo, setTitulo] = useState('Mi Cuenta'); // Estado para el título inicial
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar la visibilidad del submenú
  const flechitaRef = useRef(null); // Crea un ref para la flechita
  
  const correosAdmin = [
    "juaniellok@gmail.com",
    "juanmacen547@gmail.com",
    // Agrega más correos aquí según sea necesario
  ];
  const esUsuarioAdmin = usuario && correosAdmin.includes(usuario.correo);


  const navigate = useNavigate()
  const removeToken = () => {
    localStorage.removeItem("token");
  };


  const seleccionarOpcion = (opcion) => {
    setTitulo(opcion);
    setIsMenuOpen(false); // Cierra el menú

    // Rota la flechita hacia abajo (0 grados)
    if (flechitaRef.current) {
      flechitaRef.current.style.transform = "rotate(0deg)";
    }
  };

  const openSubMenu = (event) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => {
      const nuevoEstado = !prev;

      // Rota la flechita hacia arriba (90 grados) si se abre
      if (flechitaRef.current) {
        flechitaRef.current.style.transform = nuevoEstado ? "rotate(-180deg)" : "rotate(0deg)";
      }

      return nuevoEstado;
    });
  };


  useEffect(() => {
    if (token) {
      axios
        .get(`http://192.168.100.200:4000/user`, {
          headers: {
            token: token,
          },
        })
        .then(({ data }) => setUsuario(data)) // Guarda todos los datos del usuario
        .catch((error) => console.error(error));
    }
  }, [token]);



  const Loader = ({ size = "2rem" }) => {
    return (
      <div style={{ width: size, height: size, alignSelf: "center", marginTop: "2rem",  }} className='spinner' />
    );
  };

  return (
    <main className="UserProfile-Main">
      <section className="select-section">
        <article className="select-section-title" onClick={openSubMenu}>
          <p>{titulo}</p>
          <svg
            ref={flechitaRef} // Asigna el ref al SVG
            className="svg-flechita-nav-sub"
            viewBox="0 0 18 7.742"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth={2.0}
          >
            <path
              d="M0,.839,6.44,9,0,17.162.818,18,7.743,9.225,7.522,9l.22-.225L.818,0Z"
              fill="#000"
              transform="translate(18) rotate(90)"
            />
          </svg>
        </article>
        <article className={`select-section-list-container ${isMenuOpen ? 'active' : ''}`}>
          <ul className="select-section-list-ul">
            {['Mi Cuenta', 'Mis Pedidos', 'Mis Favoritos'].map((opcion) => (
              <li
                key={opcion}
                onClick={() => seleccionarOpcion(opcion)}
                style={{
                  borderLeft: titulo === opcion ? '3px solid var(--grey-color)' : 'none', // Aplica el borde si coincide con el título
                }}
              >
                {opcion}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="user-data-section-selected-container">
        <h4>Resumen</h4>
        {titulo === "Mi Cuenta" ? (
          <article className="user-data-section-selected-article">
            <h5>Mis Datos</h5>
            <div className="userData">
              <h6>Informacion de Contacto</h6>
              {usuario ? ( // Verifica que usuario no sea null
                <>
                  <p>{usuario.nombre}</p>
                  <p>{usuario.correo}</p>
                </>
              ) : (
                <Loader /> // Mensaje de carga mientras se obtienen los datos
              )}
            </div>
            <div className="edit-controllers-btns">
              {/* <button>Editar</button>
              <button>Eliminar Usuario</button> */}
              <a href="/login" onClick={removeToken}>cerrar Sesión</a>
              {esUsuarioAdmin && (
                <a href="/ProductManager" className="admin-button">Página Admin</a> // Aquí agregas el botón
              )}
            </div>
          </article>
        ) : titulo === "Mis Pedidos" ? (
          <article className="user-data-section-selected-article">
            <Orders />
          </article>
        ) : titulo === "Mis Favoritos" ? (
          <article className="user-data-section-selected-article">

          </article>
        ) : null}
      </section>
    </main>
  );
};

export default UserProfile;