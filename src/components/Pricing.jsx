import '../css/App.css';
import { Link, useNavigate } from 'react-router-dom';

// import productsData from '../data/Products.json';
import CartContext from "./cart/CartContext"; // Importa CartContext
import { useContext } from 'react';

function Pricing() {

    const { addItemToCart, cartItems, products } = useContext(CartContext);
    // console.log(products);
    const navigate = useNavigate()
    return (
        <>
            <section className='pricing-section-container-title'>
                <article>
                    <h4>
                        Conocé nuestros <br />
                        <strong>Precios</strong>
                    </h4>
                    <p>Obtené más beneficios conociendo nuestros paquetes. ¡Consultanos!</p>
                </article>
            </section>
            <section className='pricing-section-container'>

                {products && products.map((product, i) => (
                    <article className='pricing-article' key={i}>
                        {/* <a href="/products/detail/<%= element.id %>"> */}
                        <Link to={`/producto/${product._id}`} key={i}>
                            <div
                                className='pricing-article-header'
                                style={product.name === "Plan Ecommerce" ? { backgroundColor: "#0090cb" } : {}}
                            >
                                <p style={product.name === "Plan Ecommerce" ? { color: "#eeeeee" } : {}}>{product.name}</p>
                                <span style={product.name === "Plan Ecommerce" ? { color: "#eeeeee" } : {}}>{product.price}</span>
                                <small style={product.name === "Plan Ecommerce" ? { color: "#eeeeee" } : {}}>valor por pago mensual</small>
                            </div>
                        </Link>
                        {/* </a> */}

                        <div className='pricing-article-features'>
                            <ul>
                                {product.features && product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                            {cartItems.some(item => item._id === product._id) ? (
                                <button onClick={() => navigate("/cart")}>En el carrito</button> // Botón deshabilitado si ya está en el carrito
                            ) : (
                                <button onClick={() => addItemToCart(product)}>
                                    Añadir al Carrito
                                </button>
                            )}

                        </div>
                    </article>
                ))}
            </section>
        </>

    );
}

export default Pricing;
