import React from 'react';
import { Signup as SignupComponent } from '../components';

function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-indigo-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 transition-transform hover:scale-[1.02]">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Join MediVerse
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Create your account to start exploring and sharing knowledge
        </p>

        {/* Signup form component */}
        <SignupComponent />
      </div>
    </div>
  );
}

export default Signup;
