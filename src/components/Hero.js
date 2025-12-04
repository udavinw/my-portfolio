import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download } from 'lucide-react';
import profilePhoto from '../assets/profile.jpg';
import resumePDF from '../resume.pdf';

const Hero = ({ scrollToSection }) => {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-20">
            {/* Background Elements removed - using global Background */}

            <div className="relative z-10 px-6 w-full max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1 text-center lg:text-left space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                                <div className="mb-2">
                                    <span className="text-gray-900 dark:text-white">Hi, I'm</span>
                                </div>
                                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                                    Udavin Wijesundara
                                </div>
                            </h1>

                            <div className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-300">
                                Software Engineer & Web Developer
                                <span className="inline-block ml-2 w-1 h-8 bg-blue-500 animate-pulse"></span>
                            </div>
                        </div>

                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                            Passionate about crafting elegant solutions and pushing the boundaries of what's possible with code.
                            Currently building the future, one line at a time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => scrollToSection('projects')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-semibold overflow-hidden shadow-lg hover:shadow-blue-500/25"
                            >
                                <span className="relative flex items-center justify-center gap-2">
                                    Explore My Work
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open(resumePDF, '_blank')}
                                className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-semibold hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg backdrop-blur-sm"
                            >
                                <span className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    <Download size={20} className="transition-transform group-hover:scale-110" />
                                    Download Resume
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="order-1 lg:order-2 flex justify-center lg:justify-end"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-1 animate-spin-slow">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
                            </div>

                            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                                <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                                    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
                                        <img
                                            src={profilePhoto}
                                            alt="Udavin Wijesundara"
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</span>
                    <div className="p-2 rounded-full border-2 border-gray-300 dark:border-gray-600">
                        <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
