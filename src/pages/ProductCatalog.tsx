import { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart, Search, Filter, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCatalog() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .gt('stock_quantity', 0);

      if (fetchError) throw fetchError;

      setProducts(data || []);
      setFilteredProducts(data || []);

      const uniqueCategories = [...new Set((data || []).map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleAddToCart = (productId: string) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      newCart.set(productId, (newCart.get(productId) || 0) + 1);
      return newCart;
    });
  };

  const cartTotal = Array.from(cart.entries()).reduce((sum, [productId, qty]) => {
    const product = products.find((p) => p.id === productId);
    return sum + (product?.price || 0) * qty;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">EShop</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{user?.full_name}</span>
            <Link to="/profile" className="text-blue-400 hover:text-blue-300">
              Profile
            </Link>
            <Link to="/orders" className="text-blue-400 hover:text-blue-300">
              Orders
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center gap-2 text-red-100">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Filter size={20} />
                Filters
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Shopping Cart</h3>
              {cart.size === 0 ? (
                <p className="text-slate-400 text-sm">Cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {Array.from(cart.entries()).map(([productId, qty]) => {
                    const product = products.find((p) => p.id === productId);
                    return (
                      <div key={productId} className="text-sm">
                        <p className="text-white font-medium">{product?.name}</p>
                        <p className="text-slate-400">
                          {qty} x ${product?.price.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                  <div className="border-t border-slate-700 pt-3 mt-3">
                    <p className="text-white font-semibold">
                      Total: ${cartTotal.toFixed(2)}
                    </p>
                  </div>
                  <Link
                    to="/checkout"
                    state={{ cart, total: cartTotal }}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-400 text-lg">No products found</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition"
                  >
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-blue-400 font-bold text-lg">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-slate-500 text-sm">
                            {product.stock_quantity} in stock
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
