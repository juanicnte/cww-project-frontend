import { Fade } from 'react-reveal';
import '../css/App.css'

function WhyChooseUs() {
    return (
        <>
            <main className='whyChooseUs-mainContainer'>
                <Fade>
                    <picture className='WhyChooseUs-picture' >
                        <img src="/img/plano-cms-computadora.png" alt="" />
                    </picture>
                </Fade>
                <section className='WhyChooseUs-section'>
                    <article className='WhyChooseUs-title-article'>
                        <p className='WhyChooseUs-title'>¿Por qué elegirnos?</p>
                        <p className='WhyChooseUs-subTitle'>El tiempo es eficiencia Conoce nuestros diferenciales</p>
                    </article>
                    <article className='WhyChooseUs-article'>
                            <Fade>
                        <div className='WhyChooseUs-svg'>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="#eeeeee" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>

                        </div>
                            </Fade>
                        <div className='WhyChooseUs-article-description'>
                            <h3 >Conocemos tu mercado</h3>
                            <p >Amamos lo digital y conocemos tu rubro, lo que nos permite realizar implementaciones acorde a tu negocio.</p>
                        </div>
                    </article>
                    <article className='WhyChooseUs-article'>
                            <Fade>
                        <div className='WhyChooseUs-svg'>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="#eeeeee" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>

                        </div>
                            </Fade>
                        <div className='WhyChooseUs-article-description'>
                            <h3 >Equipo de Trabajo Dedicado</h3>
                            <p >Contamos con un equipo capacitado en las distintas áreas el cual se centra en la mejora continua de tu marca.</p>
                        </div>
                    </article>
                    <article className='WhyChooseUs-article'>

                            <Fade>
                        <div className='WhyChooseUs-svg'>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="#eeeeee" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>

                        </div>
                            </Fade>
                        <div className='WhyChooseUs-article-description'>
                            <h3>Analizamos primero</h3>
                            <p>Previo a tomar una decisión sobre los objetivos y obtenemos conclusiones.</p>
                        </div>
                    </article>
                </section>
                <section className='emails-contact-startNow'>
                    <h2>Emails corporativos, dominio propio y más!</h2>
                    <a href="/contacto">¡Empezá ahora!</a>
                </section>
            </main>
        </>
    )
}

export default WhyChooseUs;