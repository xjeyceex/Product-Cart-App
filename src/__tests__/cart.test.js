import { describe, expect, it } from 'vitest';

const applyCoupon = (items, code) => {
  if (code !== 'SAVE10') return items;
  return items.map(item => {
    if (item.price >= 100) {
      const discount = Math.min(item.price * 0.10, 50);
      return {
        ...item,
        total: (item.price - discount) * item.quantity
      };
    }
    return item;
  });
};

describe('Coupon Logic', () => {
  it('should apply 10% discount up to $50 for eligible items', () => {
    const cart = [
      { price: 600, quantity: 1, total: 600 },
      { price: 80, quantity: 2, total: 160 },
    ];
    const updated = applyCoupon(cart, 'SAVE10');
    expect(updated[0].total).toBe(550); // $50 max discount
    expect(updated[1].total).toBe(160); // not eligible
  });

  it('should not apply discount if coupon is invalid', () => {
    const cart = [{ price: 120, quantity: 1, total: 120 }];
    const updated = applyCoupon(cart, 'INVALID');
    expect(updated[0].total).toBe(120);
  });
});
