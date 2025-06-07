import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <main className="py-4 px-12 flex gap-8 w-full">
        <div className="flex-[2]">
          <h1 className="text-2xl font-bold mb-4">Product Store</h1>
          <ProductList />
        </div>
        <aside className="flex-[1] sticky top-16 self-start border p-4 rounded shadow">
          <Cart />
        </aside>
      </main>
    </CartProvider>
  );
}
