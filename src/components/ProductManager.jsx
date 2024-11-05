import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManager = () => {
  const token = localStorage.getItem("token");
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [features, setFeatures] = useState([]);
  const [description, setDescription] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);  // ID del producto que estamos editando

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.100.200:4000/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProducts();
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        name,
        img,
        price: parseFloat(price),
        description,
        category,
        features,
      };

      const response = await axios.post('http://192.168.100.200:4000/products', newProduct);
      setProducts([...products, response.data]);
      resetForm();
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setImg('');
    setPrice('');
    setCategory('');
    setDescription('');
    setFeatures([]);
    setEditingProductId(null);
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://192.168.100.200:4000/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const startEditingProduct = (product) => {
    setName(product.name);
    setImg(product.img);
    setPrice(product.price);
    setCategory(product.category);
    setDescription(product.description);
    setFeatures(product.features || []);
    setEditingProductId(product._id);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        name,
        img,
        price: parseFloat(price),
        description,
        category,
        features,
      };

      const response = await axios.put(`http://192.168.100.200:4000/products/${editingProductId}`, updatedProduct);
      setProducts(products.map(product => product._id === editingProductId ? response.data : product));
      resetForm();
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  };

  return (
    <div>
      <h1>Gestor de Productos</h1>
      <form onSubmit={editingProductId ? updateProduct : createProduct}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <h3>Características (features)</h3>
        {features.map((feature, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Característica"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              required
            />
            <button type="button" onClick={() => removeFeature(index)}>Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={addFeature}>Agregar Característica</button>

        <button type="submit">{editingProductId ? 'Actualizar Producto' : 'Agregar Producto'}</button>
        {editingProductId && <button type="button" onClick={resetForm}>Cancelar edición</button>}
      </form>

      <h2>Lista de Productos</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.price}
            <button onClick={() => startEditingProduct(product)}>Editar</button>
            <button onClick={() => deleteProduct(product._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
