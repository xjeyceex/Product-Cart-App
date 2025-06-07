import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from './ProductList';

jest.mock('../context/CartContext', () => ({
  useCart: jest.fn(),
}));

const { useCart: mockUseCart } = require('../context/CartContext');

beforeEach(() => {
  jest.clearAllMocks();

  mockUseCart.mockReturnValue({
    addToCart: jest.fn(),
  });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, title: 'Product 1', price: 10.99, image: 'image1.jpg' },
          { id: 2, title: 'Product 2', price: 20.5, image: 'image2.jpg' },
        ]),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders products and allows quantity change and add to cart', async () => {
  const addToCartMock = jest.fn();
  mockUseCart.mockReturnValue({ addToCart: addToCartMock });

  render(<ProductList />);

  // Use findByText to wait for async rendered text
  expect(await screen.findByText('Product 1')).toBeInTheDocument();
  expect(await screen.findByText('Product 2')).toBeInTheDocument();

  const quantityInputs = screen.getAllByRole('spinbutton');
  expect(quantityInputs[0]).toHaveValue(1);

  fireEvent.change(quantityInputs[0], { target: { value: '3' } });
  expect(quantityInputs[0]).toHaveValue(3);

  const addButtons = screen.getAllByText('Add to Cart');
  fireEvent.click(addButtons[0]);

  expect(addToCartMock).toHaveBeenCalledWith(
    expect.objectContaining({ id: 1, title: 'Product 1', price: 10.99 }),
    3
  );
});

test('handles fetch error and displays error message', async () => {
  mockUseCart.mockReturnValue({ addToCart: jest.fn() });

  global.fetch = jest.fn(() => Promise.reject(new Error('API error')));

  const originalError = console.error;
  console.error = jest.fn();

  render(<ProductList />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Error: API error');

  console.error = originalError;
});
