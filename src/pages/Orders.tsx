import { useState, useEffect } from 'react';
import { supabase, Order } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
          <Link to="/dashboard" className="text-blue-400 hover:text-blue-300">
            Back to Shop
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center gap-2 text-red-100">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-4">No orders yet</p>
            <Link
              to="/dashboard"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Order ID</p>
                    <p className="text-white font-mono text-sm">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Status</p>
                    <span
                      className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                        order.status === 'completed'
                          ? 'bg-green-900 text-green-100'
                          : order.status === 'pending'
                          ? 'bg-yellow-900 text-yellow-100'
                          : 'bg-red-900 text-red-100'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Date</p>
                    <p className="text-white">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Total Amount</p>
                    <p className="text-blue-400 font-bold text-lg">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
