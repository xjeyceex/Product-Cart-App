import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart and coupon state from localStorage on init
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [couponCode, setCouponCode] = useState(() => {
    return localStorage.getItem('couponCode') || '';
  });
  const [isCouponApplied, setIsCouponApplied] = useState(() => {
    return localStorage.getItem('isCouponApplied') === 'true' || false;
  });
  const [grandTotal, setGrandTotal] = useState(0);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('couponCode', couponCode);
    localStorage.setItem('isCouponApplied', isCouponApplied);
  }, [couponCode, isCouponApplied]);

  useEffect(() => {
    calculateTotal();

    const totalBeforeDiscount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (isCouponApplied && totalBeforeDiscount <= 100) {
      setIsCouponApplied(false);
      setCouponCode('');
      setCouponError('Coupon removed: Cart total dropped below $100.');
    }
  }, [cart, isCouponApplied]);

  useEffect(() => {
    if (!couponError) return;

    const timer = setTimeout(() => {
      setCouponError('');
    }, 3000); 

    return () => clearTimeout(timer);
  }, [couponError]);


  const addToCart = (product, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                price: product.price,
                total: product.price * (item.quantity + quantity),
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity,
          total: product.price * quantity,
        },
      ];
    });
    setCouponError('');
  };

  const updateQuantity = (id, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              quantity,
              price: item.price,
              total: item.price * quantity,
            }
          : item
      )
    );
    setCouponError('');
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    setCouponError('');
  };

  const applyCoupon = () => {
    const trimmedCode = couponCode.trim();
    setCouponError('');

    if (!trimmedCode) {
      setCouponError('Coupon code should not be empty.');
      return;
    }

    if (trimmedCode !== 'SAVE10') {
      setCouponError('Invalid coupon code.');
      return;
    }

    const cartTotalBeforeDiscount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (cartTotalBeforeDiscount <= 100) {
      setCouponError('Cart total must be over $100 to apply this coupon.');
      return;
    }

    setIsCouponApplied(true);
    setCouponError('');
  };

  const removeCoupon = () => {
    setIsCouponApplied(false);
    setCouponCode('');
    setCouponError('');
  };

  const calculateTotal = () => {
    const totalBeforeDiscount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (isCouponApplied) {
      const discount = Math.min(totalBeforeDiscount * 0.10, 50);
      setGrandTotal(totalBeforeDiscount - discount);
    } else {
      setGrandTotal(totalBeforeDiscount);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        grandTotal,
        couponCode,
        setCouponCode,
        applyCoupon,
        removeCoupon,
        couponError,
        isCouponApplied,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
