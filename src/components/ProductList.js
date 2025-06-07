import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState(null);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProducts(data);
        const initialQuantities = data.reduce((acc, item) => {
          acc[item.id] = 1;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProducts();
  }, []);

  const handleChange = (id, value) => {
    if (value < 1) return; // prevent zero or negative values
    setQuantities({ ...quantities, [id]: value });
  };

  // Close modal on ESC key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (error) return <div role="alert" className="text-red-600 font-semibold p-4">{`Error: ${error}`}</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div 
            key={product.id} 
            className="border rounded-lg shadow-sm p-5 flex flex-col items-center hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer"
            aria-label={`Product: ${product.title}`}
            onClick={() => setSelectedProduct(product)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedProduct(product); }}
          >
            <img 
              src={product.image} 
              alt={product.title} 
              className="h-40 w-40 object-contain mb-4 pointer-events-none"
              loading="lazy"
            />
            <h2 className="text-lg font-semibold text-center mb-2 line-clamp-2 pointer-events-none">{product.title}</h2>
            <p className="text-xl font-bold text-green-700 mb-3 pointer-events-none">${product.price.toFixed(2)}</p>

            <div 
              className="flex items-center gap-2 mb-4 pointer-events-auto" 
              onClick={e => e.stopPropagation()} // Prevent card click when interacting with input
            >
              <label htmlFor={`quantity-${product.id}`} className="sr-only">Quantity</label>
              <input
                id={`quantity-${product.id}`}
                type="number"
                min="1"
                value={quantities[product.id] || 1}
                onChange={e => handleChange(product.id, Number(e.target.value))}
                className="w-20 p-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              onClick={e => {
                e.stopPropagation(); // Prevent modal opening
                addToCart(product, quantities[product.id] || 1);
                setQuantities(prev => ({ ...prev, [product.id]: 1 })); // reset quantity
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 rounded-md shadow-md transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 pointer-events-auto"
              aria-label={`Add ${quantities[product.id] || 1} of ${product.title} to cart`}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onClick={() => setSelectedProduct(null)} // close modal on backdrop click
        >
          <div 
            className="bg-white rounded-lg max-w-lg w-full p-6 relative"
            onClick={e => e.stopPropagation()} // Prevent close on modal content click
          >
            <button
              onClick={() => setSelectedProduct(null)}
              aria-label="Close modal"
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold focus:outline-none"
            >
              &times;
            </button>

            <h3 id="modal-title" className="text-xl font-bold mb-4">{selectedProduct.title}</h3>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              className="h-48 w-48 object-contain mx-auto mb-4"
              loading="lazy"
            />
            <p id="modal-description" className="mb-4 text-gray-700">{selectedProduct.description}</p>
            <p className="font-semibold text-green-700 mb-2">Price: ${selectedProduct.price.toFixed(2)}</p>
            <p className="mb-4">Category: <em>{selectedProduct.category}</em></p>
            <p className="text-sm text-gray-500 mb-6">
              Rating: {selectedProduct.rating.rate} ({selectedProduct.rating.count} reviews)
            </p>

            <div className="flex items-center gap-2 mb-4">
              <label htmlFor={`modal-quantity-${selectedProduct.id}`} className="sr-only">Quantity</label>
              <input
                id={`modal-quantity-${selectedProduct.id}`}
                type="number"
                min="1"
                value={quantities[selectedProduct.id] || 1}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val < 1) return;
                  setQuantities(prev => ({ ...prev, [selectedProduct.id]: val }));
                }}
                className="w-20 p-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

           <button
              onClick={() => {
                addToCart(selectedProduct, quantities[selectedProduct.id] || 1);
                setQuantities(prev => ({ ...prev, [selectedProduct.id]: 1 })); // reset quantity
                setSelectedProduct(null); // close modal after adding
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 rounded-md shadow-md transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label={`Add ${quantities[selectedProduct.id] || 1} of ${selectedProduct.title} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}
