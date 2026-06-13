import React from 'react';
import { Login as LoginComponent, Logo } from '../components';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 relative overflow-hidden">
      {/* Background blobs for glassmorphic depth */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-md w-full bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo width="80px" />
        </div>

        <h1 className="text-3xl font-extrabold text-center mb-2 text-gray-800 tracking-tight">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Login to access your MediVerse dashboard
        </p>

        {/* Render the Login form component */}
        <LoginComponent />

        <p className="text-center text-sm text-gray-500 mt-8">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:underline transition">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
