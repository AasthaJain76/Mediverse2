import React from 'react';
import { Signup as SignupComponent, Logo } from '../components';
import { Link } from 'react-router-dom';

function Signup() {
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
          Join MediVerse 🚀
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Create your account to start your journey
        </p>

        {/* Signup form component */}
        <SignupComponent />

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
