import React from 'react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cart,
    grandTotal,
    applyCoupon,
    removeCoupon,
    couponCode,
    setCouponCode,
    updateQuantity,
    removeFromCart,
    couponError,
    isCouponApplied,
  } = useCart();

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(1, Number(value)); 
    updateQuantity(id, qty);
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.id} className="flex items-center mb-4">
              <img src={item.image} alt={item.title} className="w-16 h-16 object-contain mr-4" />
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <div className="flex items-center space-x-4">
                  <label>
                    Qty:{' '}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => handleQuantityChange(item.id, e.target.value)}
                      className="border p-1 w-16"
                    />
                  </label>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:underline"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </div>
                <p>Total: ${item.total.toFixed(2)}</p>
              </div>
            </div>
          ))}

          <div className="mt-4">
            {isCouponApplied ? (
              <div className="flex items-center space-x-4">
                <span className="text-green-600 font-medium">
                  ✅ Coupon <strong>"SAVE10"</strong> applied successfully! Up to $50 discount.
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-red-500 underline text-sm"
                >
                  Remove Coupon
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyCoupon();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon"
                  className="border px-2 py-1"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-1">
                  Apply Coupon
                </button>
              </form>
            )}
          </div>

          {couponError && (
            <p style={{ color: 'red', marginTop: '0.5rem' }}>{couponError}</p>
          )}
          <h3 className="mt-4 font-bold text-lg">Grand Total: ${grandTotal.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}
