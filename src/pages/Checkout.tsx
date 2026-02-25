import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = location.state?.cart as Map<string, number> | undefined;
  const total = location.state?.total || 0;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!cart || cart.size === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: total,
          status: 'completed',
        })
        .select()
        .maybeSingle();

      if (orderError) throw orderError;
      if (!orderData) throw new Error('Failed to create order');

      const orderItems = Array.from(cart.entries()).map(([productId, quantity]) => ({
        order_id: orderData.id,
        product_id: productId,
        quantity,
        price_at_purchase: 0,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      setSuccess('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
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

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>

          <div className="space-y-3 mb-6">
            {Array.from(cart.entries()).map(([productId, qty]) => (
              <div key={productId} className="flex justify-between text-slate-300">
                <span>Product {productId.substring(0, 8)}</span>
                <span>Qty: {qty}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-700 pt-4">
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total:</span>
              <span className="text-blue-400">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
