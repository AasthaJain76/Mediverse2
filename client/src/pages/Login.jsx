import React from 'react';
import { Login as LoginComponent } from '../components';

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-center mb-4 text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Login to your MediVerse account
        </p>

        {/* Render the Login form component */}
        <LoginComponent />

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
