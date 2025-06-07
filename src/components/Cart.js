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
    <div className="mt-8 border-t pt-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Cart Summary</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-12">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow bg-white"
                role="group"
                aria-label={`Cart item: ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-contain rounded-md border"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>

                  <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center space-x-2 text-gray-700">
                      <span className="text-sm font-medium">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.id, e.target.value)}
                        className="w-16 p-1 border rounded-md text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={`Quantity of ${item.title}`}
                      />
                    </label>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none focus:underline"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      Remove
                    </button>
                  </div>

                  <p className="mt-2 font-semibold text-gray-800">
                    Total: ${item.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-md">
            {isCouponApplied ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-md">
                <span className="font-semibold text-sm">
                  ✅ Coupon <strong>"SAVE10"</strong> applied successfully! Up to $50 discount.
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-green-800 underline text-sm font-medium hover:text-green-900 focus:outline-none"
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
                className="flex gap-2"
                aria-label="Apply coupon code"
              >
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon"
                  className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 active:bg-indigo-800 font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="mt-2 text-sm text-red-600 font-medium">{couponError}</p>
            )}

            <h3 className="mt-6 text-xl font-bold text-gray-900">
              Grand Total: ${grandTotal.toFixed(2)}
            </h3>
          </div>
        </>
      )}
    </div>
  );
}
