import React from 'react';
import Logo from '../components/Logo';

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          
          <h1  className="text-2xl md:text-3xl font-extrabold text-blue-600 mb-8">
            About MediVerse
          </h1>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl">
            MediVerse is my personal project to help learners explore coding, follow structured roadmaps, and connect with a supportive community.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-12">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-3 sm:mb-4">My Mission</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              To empower aspiring developers by providing clear learning roadmaps, practical resources, and a community-driven environment for growth.
            </p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-3 sm:mb-4">My Vision</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              To create a platform where anyone can learn coding effectively, stay motivated, and achieve their development goals.
            </p>
          </div>
        </div>

        {/* Personal Story */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 mb-12 hover:shadow-xl transition">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-3 sm:mb-4">About Me</h2>
          <p className="text-gray-600 text-sm sm:text-base text-center">
            Hi, I’m Aastha Jain 👋. I built MediVerse to share my passion for programming and help others navigate the vast world of coding. From learning data structures to building real projects, I aim to make the journey simpler and more enjoyable for everyone.
          </p>
        </div>

        {/* Project Highlights */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 mb-12 hover:shadow-xl transition">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-3 sm:mb-4">Project Highlights</h2>
          <div className="text-gray-600 space-y-4 text-sm sm:text-base">
            <p><span className="font-semibold">MediVerse – Full-Stack Community Platform | MERN, REST APIs, AI Integration</span></p>
            <ul className="list-disc list-inside space-y-2">
              <li>Built a community platform with user authentication, posts, and threaded discussions.</li>
              <li>Developed REST APIs with Express.js and MongoDB for full CRUD operations.</li>
              <li>Integrated Clist.by API for real-time coding contests.</li>
              <li>Created personalized profiles showcasing skills, achievements, and GitHub/LinkedIn.</li>
              <li>Implemented AI-powered roadmap generator and resume analyzer for career guidance.</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-indigo-600 text-white rounded-3xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Join the MediVerse Community</h2>
          <p className="text-sm sm:text-base mb-6">Explore coding challenges, structured roadmaps, and connect with fellow learners.</p>
          <a
            href="/home"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition text-sm sm:text-base"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
