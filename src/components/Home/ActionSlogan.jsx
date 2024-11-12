import Flickity from 'react-flickity-component';
import { trackEvent } from '../context/trackPageView.jsx';
import { Link } from 'react-router-dom';
const flickityOptions = {
    cellAlign: 'left',
    contain: true,
    percentPosition: false,
    prevNextButtons: false,
    pageDots: false,
    resize: true,
    autoPlay: true
};

const esloganImg = [
    "https://www.gap.com/webcontent/0055/941/643/cn55941643.jpg",
    "https://www.gap.com/webcontent/0055/684/630/cn55684630.jpg",
    "https://www.gap.com/webcontent/0055/908/034/cn55908034.jpg"
];


function ActionSlogan() {
    return (
        <div className='container-carousel'>
            {/* <Flickity
                className={'carousel'}
                elementType={'div'}
                options={flickityOptions}
                disableImagesLoaded={false}
                reloadOnUpdate
                static
            >
                
                {esloganImg.map((image, index) => (
                    <img src={image} alt={`Slogan ${index + 1}`} className='carrousel-img' />
                ))}
            </Flickity> */}
            <video
                autoPlay
                loop
                muted
                width="100%"
                height="100%"
                // poster=""
                src="/videos/videoOficina.mp4"
                style={{ filter: 'brightness(0.5)' }}
            ></video>
            <Link to="/contacto" className='container-link-form' onClick={trackEvent('contactar', 'Contacto', 'Ingreso al formulario de contacto', 1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--terciary-color)" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                ¡Empezá Ahora!
            </Link>

        </div>
    );
}

export default ActionSlogan;
