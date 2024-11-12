import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./users.css"

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
        if (token) {
            try {
                const response = await axios.get('http://192.168.100.200:4000/orders', {
                    headers: {
                        token: token,
                    },
                });
                setOrders(response.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data.mensaje || 'Error al obtener los pedidos');
            }
        } else {
            setError('No se encontró el token');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    return (
        <div className="orders-container">
            <h1>Mis Pedidos</h1>
            {error && <p className="error-message">{error}</p>}
            {orders.length === 0 ? (
                <p className="no-orders-message">No tienes ninguna compra.</p>
            ) : (
                <div className="order-list">
                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <h2>Pedido ID: {order._id}</h2>
                                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="order-details">
                                <p>Monto total: <strong>{order.transaction_amount}</strong></p>
                                <p>Estado: <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></p>
                                <div className="order-items">
                                    {order.items.slice(0, 5).map(item => (
                                        <div key={item._id} className="order-item">
                                            <img src={item.image} alt={item.title} className="item-image" />
                                            <div className="item-info">
                                                <p>{item.title}</p>
                                                <p>cantidad: {item.quantity}</p>
                                                <p>Precio: {item.unit_price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.length > 5 && (
                                        <p className="more-items">+{order.items.length - 5} productos más</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
