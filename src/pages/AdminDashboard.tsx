import { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    image_url: '',
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase.from('products').select('*');
      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category: formData.category,
        image_url: formData.image_url,
        created_by: user?.id,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);
        if (updateError) throw updateError;
        setSuccess('Product updated successfully');
      } else {
        const { error: insertError } = await supabase.from('products').insert([productData]);
        if (insertError) throw insertError;
        setSuccess('Product added successfully');
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category: '',
        image_url: '',
      });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      category: product.category,
      image_url: product.image_url,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error: deleteError } = await supabase.from('products').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{user?.full_name}</span>
            <button
              onClick={() => logout()}
              className="text-red-400 hover:text-red-300"
            >
              Logout
            </button>
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

        {success && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg flex items-center gap-2 text-green-100">
            <CheckCircle size={20} />
            {success}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <button
            onClick={() => {
              setFormData({
                name: '',
                description: '',
                price: '',
                stock_quantity: '',
                category: '',
                image_url: '',
              });
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {showForm && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="md:col-span-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                rows={3}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="url"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="md:col-span-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No products yet</p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <p className="text-slate-400 text-sm">{product.category}</p>
                  <p className="text-blue-400 font-bold mt-2">
                    ${product.price.toFixed(2)} • {product.stock_quantity} units
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
