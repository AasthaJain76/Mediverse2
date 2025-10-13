// File: src/pages/Features.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const featureList = [
    {
      title: '🧵 Discussion Forum',
      desc: 'Ask questions, share knowledge, and collaborate with peers.',
      link: '/forum',
      linkText: 'Go to Forum →',
    },
    {
      title: '🏆 Competitions & Challenges',
      desc: 'Find upcoming coding contests, DSA challenges, and hackathons.',
      link: '/contests',
      linkText: 'View Contests →',
    },
    {
      title: '🚀 AI Roadmap Generator',
      desc: 'Get a personalized learning roadmap for any topic or skill using AI.',
      link: '/generate',
      linkText: 'Generate Roadmap →',
    },
    {
      title: '📄 Resume Analyzer',
      desc: 'Upload your resume to get instant AI-powered feedback and improvement suggestions.',
      link: '/resume-analyze',
      linkText: 'Analyze Resume →',
    },
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Reduced slightly for balance */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 mb-8">
          Platform Features
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-8 border border-gray-200 rounded-3xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300"
            >
              <div>
                {/* Adjusted for smoother hierarchy */}
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-5">
                  {feature.desc}
                </p>
              </div>
              <Link
                to={feature.link}
                className="mt-auto inline-block text-center px-6 py-2 text-sm md:text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-full hover:from-blue-700 hover:to-blue-600 transition"
              >
                {feature.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
