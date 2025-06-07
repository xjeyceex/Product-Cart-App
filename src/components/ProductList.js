import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        const initialQuantities = data.reduce((acc, item) => {
          acc[item.id] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      });
  }, []);

  const handleChange = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="border p-4 rounded">
          <img src={product.image} alt={product.title} className="h-40 object-contain mb-2" />
          <h2 className="text-lg font-medium">{product.title}</h2>
          <p>${product.price.toFixed(2)}</p>
          <input
            type="number"
            min="1"
            value={quantities[product.id] || 1}
            onChange={e => handleChange(product.id, Number(e.target.value))}
            className="border mt-2 p-1 w-16"
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 mt-2"
            onClick={() => addToCart(product, quantities[product.id] || 1)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}