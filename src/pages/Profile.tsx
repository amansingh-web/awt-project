import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Shop
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-600 p-4 rounded-full">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.full_name}</h2>
              <p className="text-slate-400">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-slate-700 pb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Mail size={18} />
                Email Address
              </label>
              <p className="text-white text-lg">{user?.email}</p>
            </div>

            <div className="border-b border-slate-700 pb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <p className="text-white text-lg">{user?.full_name}</p>
            </div>

            <div className="border-b border-slate-700 pb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Member Since</label>
              <p className="text-white text-lg">
                {new Date(user?.created_at || '').toLocaleDateString()}
              </p>
            </div>

            <div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
