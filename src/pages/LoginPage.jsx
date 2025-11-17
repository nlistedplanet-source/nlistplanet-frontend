import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-white flex">
      {/* Illustration Section */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden"
      >
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-cyan-200/40 rounded-full blur-3xl" />
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 max-w-sm text-center space-y-6 px-8"
        >
          <img src="/images/logos/herolaptop.png" alt="Illustration" className="w-full max-w-xs mx-auto drop-shadow-xl" />
          <h2 className="text-3xl font-bold text-gray-800">Trade Smarter</h2>
          <p className="text-gray-600 text-sm leading-relaxed">Access India's trusted unlisted marketplace. Monitor bids, manage your holdings and discover emerging opportunities.</p>
        </motion.div>
      </motion.div>

      {/* Form Section */}
      <div className="w-full lg:max-w-md mx-auto flex flex-col justify-center px-6 py-12">
        <style>{`
          .floating-label-wrap { position: relative; }
          .floating-label-wrap input::placeholder { color: transparent; }
          .floating-label { position:absolute; left:3rem; top:50%; transform:translateY(-50%); font-size:0.8rem; color:#6b7280; pointer-events:none; transition:all .15s ease; }
          .floating-label-wrap input:focus + .floating-label,
          .floating-label-wrap input:not(:placeholder-shown) + .floating-label { top:0.45rem; left:3rem; font-size:0.60rem; font-weight:600; letter-spacing:.5px; color:#111827; background:#fff; padding:0 4px; border-radius:4px; }
        `}</style>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-gray-800 mb-6"
        >
          Sign in to your account
        </motion.h1>
        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit} 
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-5"
        >
          <div className="space-y-4">
            {/* Username / Email */}
            <div className="floating-label-wrap">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username or Email"
                className="input-mobile pl-12"
                required
              />
              <label className="floating-label" htmlFor="username">Username or Email</label>
            </div>
            {/* Password */}
            <div className="floating-label-wrap">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="input-mobile pl-12 pr-12"
                required
              />
              <label className="floating-label" htmlFor="password">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
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

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-between mt-4"
          >
            <Link to="/register" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Create account</Link>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">Home</Link>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default LoginPage;
