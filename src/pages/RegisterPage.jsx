import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, UserPlus, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateUsername, validateEmail, validatePhone } from '../utils/helpers';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    referredBy: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters, lowercase letters, numbers, and underscores only';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const { confirmPassword, ...registrationData } = formData;
    const success = await register(registrationData);

    if (success) {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Illustration Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-cyan-200/40 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-sm text-center space-y-6 px-8">
          <img src="/images/logos/herolaptop.png" alt="Illustration" className="w-full max-w-xs mx-auto drop-shadow-xl" />
          <h2 className="text-3xl font-bold text-gray-800">Join Nlist Planet</h2>
          <p className="text-gray-600 text-sm leading-relaxed">Create an account to access India’s trusted unlisted marketplace. List, bid and manage your portfolio with ease.</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:max-w-md mx-auto flex flex-col justify-center px-6 py-12">
        <style>{`
          .floating-label-wrap { position: relative; }
          .floating-label-wrap input::placeholder { color: transparent; }
          .floating-label { position:absolute; left:1rem; top:50%; transform:translateY(-50%); font-size:0.8rem; color:#6b7280; pointer-events:none; transition:all .15s ease; }
          .floating-with-icon { padding-left:3rem; }
          .floating-label-wrap input:focus + .floating-label,
          .floating-label-wrap input:not(:placeholder-shown) + .floating-label { top:0.45rem; left:1rem; font-size:0.60rem; font-weight:600; letter-spacing:.5px; color:#111827; background:#fff; padding:0 4px; border-radius:4px; }
        `}</style>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create your account</h1>
        {/* Register Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Username */}
            <div className="floating-label-wrap">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username (lowercase)"
                className={`input-mobile floating-with-icon ${errors.username ? 'border-red-500' : ''}`}
                required
              />
              <label className="floating-label">Username</label>
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Full Name */}
            <div className="floating-label-wrap">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className={`input-mobile ${errors.fullName ? 'border-red-500' : ''}`}
                required
              />
              <label className="floating-label">Full Name</label>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="floating-label-wrap">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email"
                className={`input-mobile floating-with-icon ${errors.email ? 'border-red-500' : ''}`}
                required
              />
              <label className="floating-label">Email</label>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="floating-label-wrap">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className={`input-mobile floating-with-icon ${errors.phone ? 'border-red-500' : ''}`}
                maxLength="10"
                required
              />
              <label className="floating-label">Phone Number</label>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="floating-label-wrap">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className={`input-mobile floating-with-icon pr-12 ${errors.password ? 'border-red-500' : ''}`}
                required
              />
              <label className="floating-label">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="floating-label-wrap">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={`input-mobile floating-with-icon ${errors.confirmPassword ? 'border-red-500' : ''}`}
                required
              />
              <label className="floating-label">Confirm Password</label>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Referral Code (Optional) */}
            <div className="floating-label-wrap">
              <Gift className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
              <input
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                placeholder="Enter referral code"
                className="input-mobile floating-with-icon"
              />
              <label className="floating-label">Referral Code (Optional)</label>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-mobile btn-primary mt-6 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-dark-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full btn-mobile btn-secondary text-center"
          >
            Login Instead
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
