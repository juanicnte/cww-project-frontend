import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from '../context/trackPageView.jsx';
import "./users.css"

const Register = () => {
  const [inputs, setInputs] = useState({
    correo: "",
    nombre: "",
    contraseña: "",
  });
  const [mensaje, setMensaje] = useState();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para ver la contraseña

  const navigate = useNavigate();

  const { nombre, contraseña, correo } = inputs;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setTimeout(() => {
      document.getElementById('contraseña').focus(); // Vuelve a poner el foco en el campo de la contraseña
    }, 0);
  };

  const HandleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (nombre !== "" && contraseña !== "" && correo !== "") {
      const Usuario = {
        nombre,
        correo,
        contraseña,
      };
      setLoading(true);
      await axios
        .post("http://192.168.100.200:4000/register", Usuario)
        .then((res) => {
          const { data } = res;
          setMensaje(data.mensaje);
          setInputs({ nombre: "", contraseña: "", correo: "" });
          setTimeout(() => {
            trackEvent('registro_usuario', 'Registro de usuario', 'Registro de usuario', 3);
            setMensaje("");
            navigate("/login");
          }, 1500);
        })
        .catch((error) => {
          console.error(error);
          setMensaje("Hubo un error");
          setTimeout(() => {
            setMensaje("");
          }, 1500);
        });

      setLoading(false);
    }
  };

  return (
    <>
      <div className="formContainer">
        <h3>Bienvenido a la pagina</h3>
        <h2>De Registro!</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="inputContainer">
            <div className="formLeftLogin">
              <label htmlFor="nombre">Nombre</label>
              <input
                onChange={(e) => HandleChange(e)}
                value={nombre}
                name="nombre"
                id="nombre"
                type="text"
                placeholder="Nombre..."
                autoComplete="off"
              />
            </div>
            <svg
              viewBox="0 0 30 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 7.41419C7.5 11.5019 10.865 14.8284 15 14.8284C19.135 14.8284 22.5 11.5019 22.5 7.41419C22.5 3.3265 19.135 0 15 0C10.865 0 7.5 3.3265 7.5 7.41419ZM28.3333 31.3043H28.3524C29.2623 31.3043 30 30.5667 30 29.6568C30 23.2987 24.765 18.1236 18.3333 18.1236H11.6667C5.23333 18.1236 0 23.2987 0 29.6568C0 30.5667 0.737655 31.3043 1.6476 31.3043H28.3333Z"
                fill="black"
              />
            </svg>
          </div>

          <div className="inputContainer">
            <div className="formLeftLogin">
              <label htmlFor="correo">Correo</label>
              <input
                onChange={(e) => HandleChange(e)}
                value={correo}
                name="correo"
                id="correo"
                type="email"
                placeholder="Correo..."
                autoComplete="off"
              />
            </div>
            <svg
              viewBox="0 0 30 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27 0H3C1.35 0 0.015 1.35 0.015 3L0 21C0 22.65 1.35 24 3 24H27C28.65 24 30 22.65 30 21V3C30 1.35 28.65 0 27 0ZM27 5.295C27 5.73357 26.7741 6.14121 26.4022 6.37365L19.24 10.85C16.6458 12.4714 13.3542 12.4714 10.76 10.85L3.59784 6.37365C3.22593 6.14121 3 5.73357 3 5.295C3 4.29593 4.09894 3.68684 4.94615 4.21635L11.9126 8.57039C13.8016 9.75099 16.1984 9.75099 18.0874 8.57039L25.0538 4.21635C25.9011 3.68684 27 4.29593 27 5.295Z"
                fill="black"
              />
            </svg>
          </div>

          <div className="inputContainer">
            <div className="formLeftLogin">
              <label htmlFor="contraseña">Contraseña</label>
              <input className="input-password"
                onChange={(e) => HandleChange(e)}
                value={contraseña}
                name="contraseña"
                id="contraseña"
                type={showPassword ? 'text' : 'password'} // Cambia el tipo según el estado
                placeholder="Contraseña..."
                autoComplete="off"
              />
            </div>
            <svg onClick={togglePasswordVisibility} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inputContainer-verContrasenia">
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </svg>
          </div>

          <button type="submit">
            {loading ? "Cargando..." : "Registrarme"}
          </button>
          <p>
            Ya tienes una cuenta?{" "}
            <b onClick={() => navigate("/login")}>Inicia Sesión!</b>
          </p>
        </form>
      </div>
      {mensaje && <div className="toast">{mensaje}</div>}
    </>
  );
};

export default Register;