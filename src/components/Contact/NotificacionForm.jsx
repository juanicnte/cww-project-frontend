import "./contact.css"

function NotificationForm() {
    return (
        <>
            <div className='NotificationForm-container'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <p>Formulario Enviado. ¡Nos pondremos en contacto a la brevedad!</p>
            </div>
        </>
    )
}

export default NotificationForm;