import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Product Store heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Product Store/i);
  expect(headingElement).toBeInTheDocument();
});
