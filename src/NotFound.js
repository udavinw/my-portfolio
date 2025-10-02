import React from 'react';
import { Helmet } from 'react-helmet';
import { Home, ArrowLeft, Search, Mail, Github, Linkedin } from 'lucide-react';

const NotFound = () => {
  const goHome = () => {
    window.location.href = '/';
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center px-6">
      <Helmet>
        <title>404 - Page Not Found | Udavin Wijesundara</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to Udavin Wijesundara's portfolio homepage." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-blue-200/20 dark:text-blue-800/20 animate-ping">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            The page you're looking for seems to have wandered off into the digital void.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Don't worry, even the best developers encounter 404s!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={goHome}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <Home size={20} className="transition-transform group-hover:scale-110" />
            Back to Homepage
          </button>
          
          <button
            onClick={goBack}
            className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-semibold transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg backdrop-blur-sm flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Looking for something specific?
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <a
              href="/#about"
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Search size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span>About Me</span>
            </a>
            
            <a
              href="/#projects"
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-300 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Search size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              <span>My Projects</span>
            </a>
            
            <a
              href="/#experience"
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Search size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <span>Experience</span>
            </a>
            
            <a
              href="/#contact"
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors duration-300 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
            >
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Mail size={16} className="text-pink-600 dark:text-pink-400" />
              </div>
              <span>Contact</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Or connect with me on social media:
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/udavinw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/udavin-wijesundara/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:hello@udavinwijesundara.com"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>💡 Pro tip: Check the URL for typos, or use the navigation above!</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
