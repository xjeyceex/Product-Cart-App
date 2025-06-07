import { render, screen } from '@testing-library/react';
import Cart from './Cart';

jest.mock('../context/CartContext', () => ({
  useCart: () => ({
    cart: [
      {
        id: 1,
        title: 'Product 1',
        image: 'https://via.placeholder.com/150',
        quantity: 2,
        total: 40,
      },
      {
        id: 2,
        title: 'Product 2',
        image: 'https://via.placeholder.com/150',
        quantity: 1,
        total: 20,
      },
    ],
    grandTotal: 60,
    applyCoupon: jest.fn(),
    removeCoupon: jest.fn(),
    couponCode: '',
    setCouponCode: jest.fn(),
    updateQuantity: jest.fn(),
    removeFromCart: jest.fn(),
    couponError: '',
    isCouponApplied: false,
  }),
}));

describe('Cart component', () => {
  test('renders cart items and grand total', () => {
    render(<Cart />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();

    expect(screen.getAllByLabelText(/Qty:/i)[0]).toHaveValue(2);
    expect(screen.getAllByLabelText(/Qty:/i)[1]).toHaveValue(1);

    expect(screen.getByText('Total: $40.00')).toBeInTheDocument();
    expect(screen.getByText('Total: $20.00')).toBeInTheDocument();

    expect(screen.getByText('Grand Total: $60.00')).toBeInTheDocument();
  });

  test('shows empty cart message when cart is empty', () => {
    // Override the mock to return empty cart for this test
    jest.resetModules(); // Reset modules to clear previous mocks

    jest.doMock('../context/CartContext', () => ({
      useCart: () => ({
        cart: [],
        grandTotal: 0,
        applyCoupon: jest.fn(),
        removeCoupon: jest.fn(),
        couponCode: '',
        setCouponCode: jest.fn(),
        updateQuantity: jest.fn(),
        removeFromCart: jest.fn(),
        couponError: '',
        isCouponApplied: false,
      }),
    }));

    const { default: CartEmpty } = require('./Cart');

    render(<CartEmpty />);

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });
});
