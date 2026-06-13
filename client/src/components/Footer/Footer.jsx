import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-gray-300 border-t border-slate-800/85 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="inline-block hover:opacity-90 transition w-fit">
              <Logo width="100px" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              A comprehensive web ecosystem offering career planning, custom learning roadmaps, resume parsing, and interactive discussion forums.
            </p>
            <div className="flex gap-4 text-lg pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white text-gray-400 transition duration-300">
                <FaFacebookF size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white text-gray-400 transition duration-300">
                <FaTwitter size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white text-gray-400 transition duration-300">
                <FaLinkedinIn size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white text-gray-400 transition duration-300">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200" to="/features">
                  Features
                </Link>
              </li>
              <li>
                <Link className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200" to="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200" to="/generate">
                  Roadmaps
                </Link>
              </li>
              <li>
                <Link className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200" to="/forum">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200" to="/profile">
                  Account
                </Link>
              </li>
              <li>
                <Link className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200" to="/contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <a className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200" href="#">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & System */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="text-sm text-gray-400 hover:text-indigo-400 transition duration-200" href="#">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} MediVerse. All Rights Reserved.
          </p>
          <p className="mt-2 md:mt-0">
            Built with <span className="text-indigo-500">♥</span> by DevUI
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
