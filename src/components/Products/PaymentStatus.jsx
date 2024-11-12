import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { initMercadoPago, StatusScreen } from '@mercadopago/sdk-react';

const PaymentStatus = () => {
  const { paymentId } = useParams(); // Obtén el paymentId de la URL

  useEffect(() => {
    // Inicializa el SDK de Mercado Pago con la clave pública
    initMercadoPago('TEST-f84d3d62-5a46-453e-9284-870fa3a52b0b', { locale: 'es-AR' });
  }, []);

  // Configuración del StatusScreen con personalización
  const statusScreenSettings = {
    initialization: {
      paymentId: paymentId, // Se usa el paymentId de la URL
    },
    customization: {
      visual: {
        hideStatusDetails: false, // Oculta detalles de estado
        hideTransactionDate: false,
        showExternalReference: true,        // Oculta la fecha de transacción
        style: {
          theme: 'default', // Tema de la pantalla (opciones: 'default', 'dark', 'bootstrap', 'flat')
        },
      },
      backUrls: {
        error: 'http://192.168.100.200:5173/userProfile', // URL en caso de error
        return: 'http://192.168.100.200:5173/orders', // URL de retorno después del pago
      },
    },
    callbacks: {
      onReady: () => {
        console.log('Status Screen está listo');
      },
      onError: (error) => {
        console.error('Error en Status Screen:', error);
      },
    },
  };

  return (
    <div id="status_screen_container">
      <StatusScreen initialization={statusScreenSettings.initialization} customization={statusScreenSettings.customization} />
    </div>
  );
};

export default PaymentStatus;
