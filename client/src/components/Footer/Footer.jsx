import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="relative overflow-hidden py-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap -m-4 justify-between">

          {/* Logo + Copyright */}
          <div className="w-full p-4 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4">
                <Logo width="100px" />
              </div>
              <p className="text-xs sm:text-sm text-gray-200">
                &copy; {new Date().getFullYear()} MediVerse. All Rights Reserved. <br />
                Built with <span className="text-pink-300">♥</span> by DevUI
              </p>
              <div className="mt-3 flex gap-4 text-lg">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <FaFacebookF className="hover:text-amber-300 transition" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  <FaTwitter className="hover:text-amber-300 transition" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                  <FaLinkedinIn className="hover:text-amber-300 transition" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <FaInstagram className="hover:text-amber-300 transition" />
                </a>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="w-full p-4 md:w-1/4 lg:w-2/12">
            <h3 className="mb-3 text-sm sm:text-base font-semibold uppercase tracking-wide text-gray-200">
              Explore
            </h3>
            <ul className="space-y-2">
              <li><Link className="text-xs sm:text-sm hover:text-amber-300 transition" to="/features">Features</Link></li>
              <li><Link className="text-xs sm:text-sm hover:text-amber-300 transition" to="/about">About</Link></li>
              <li><Link className="text-xs sm:text-sm hover:text-amber-300 transition" to="/generate">Roadmaps</Link></li>
              <li><Link className="text-xs sm:text-sm hover:text-amber-300 transition" to="/forum">Community</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="w-full p-4 md:w-1/4 lg:w-2/12">
            <h3 className="mb-3 text-sm sm:text-base font-semibold uppercase tracking-wide text-gray-200">
              Support
            </h3>
            <ul className="space-y-2">
              <li><Link className="text-xs sm:text-sm hover:text-amber-300 transition" to="/profile">Account</Link></li>
              <li><Link className="text-xs sm:text-sm hover:text-amber-300 transition" to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Empty space removed, adjusted layout */}
          <div className="w-full md:w-0 lg:w-3/12"></div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
