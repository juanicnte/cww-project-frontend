
import '../css/App.css';
import { Link } from 'react-router-dom';
import { trackEvent } from './trackPageView.jsx';

function Eslogan() {
    return (
        <>
            <section className='call-action-container'>
                <div className='container-eslogan'>
                    <p className='eslogan-title'>¿Todavía no llevaste tu negocio al siguiente nivel?</p>
                </div>
                <Link to="/contacto" className='container-link-form' onClick={trackEvent('contactar', 'Contacto', 'Ingreso al formulario de contacto', 1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f9a2ab" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    ¡Empezá Ahora!
                </Link>
                {/* <a href="/contacto" className='container-link-form'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f9a2ab" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    ¡Empezá Ahora!
                </a> */}
            </section>
        </>
    )
}

export default Eslogan;