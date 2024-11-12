import React, { useContext, seState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CartContext from "../context/CartContext"

const ProductDetail = () => {
    const { id } = useParams(); // Obtén el ID del producto de la URL
    const { addItemToCart, cartItems, products } = useContext(CartContext);
    const navigate = useNavigate()

    // Busca el producto por su ID
    const product = products.find((p) => p._id === id);

    // Verifica si el producto existe
    if (!product) {
        return <p>Producto no encontrado</p>;
    }
    console.log(product);


    return (
        <>
            <div className='product-detail-container'>
                <h1>Detalles del Producto</h1>
                <h2>{product.name}</h2>
                <img src={product.img} alt={product.name} />
                <p>Precio: {product.price}</p>

                {cartItems.some(item => item._id === product._id) ? (
                    <button onClick={() => navigate("/cart")}>En el carrito</button> // Botón deshabilitado si ya está en el carrito
                ) : (
                    <button onClick={() => addItemToCart(product)}>
                        Añadir al Carrito
                    </button>
                )}
            </div>
        </>
    );
};

export default ProductDetail;
