import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart, BarChart3, Zap } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">EShop</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-slate-300">{user.full_name}</span>
                <button
                  onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {user.role === 'admin' ? 'Admin Dashboard' : 'Shop Now'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome to EShop
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Your secure e-commerce platform with advanced product management
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition text-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition text-lg"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition">
            <ShoppingCart className="text-blue-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Easy Shopping</h3>
            <p className="text-slate-400">
              Browse and purchase products with a simple, intuitive interface
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition">
            <BarChart3 className="text-green-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Admin Control</h3>
            <p className="text-slate-400">
              Powerful admin dashboard for complete product management
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition">
            <Zap className="text-yellow-400 mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">Secure & Fast</h3>
            <p className="text-slate-400">
              JWT authentication and role-based access for maximum security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
