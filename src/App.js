import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
   <CartProvider>
    <main className="p-4 max-w-7xl mx-auto flex gap-8">
      <div className="flex-[2]">
        <h1 className="text-2xl font-bold mb-4">Product Store</h1>
        <ProductList />
      </div>
      <aside className="flex-[1] sticky top-4 self-start border p-4 rounded shadow max-w-md">
        <Cart />
      </aside>
    </main>
  </CartProvider>
  );
}
