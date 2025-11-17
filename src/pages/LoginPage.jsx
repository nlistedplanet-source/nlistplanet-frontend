import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(formData.username, formData.password);
    
    if (success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <img src="/images/logos/new_logo.png" alt="Nlist Planet" className="h-12 w-12 object-contain mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-dark-800 mb-1">Welcome back</h1>
          <p className="text-dark-500">Login to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-dark-100 shadow-md">
          <div className="space-y-4">
            {/* Username/Email */}
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username or email"
                  className="input-mobile pl-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-mobile pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-mobile btn-primary mt-6 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Login
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-dark-500">Don't have an account?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="block w-full btn-mobile btn-secondary text-center"
          >
            Create New Account
          </Link>
        </form>

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-dark-500 hover:text-dark-700 text-center py-3"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
