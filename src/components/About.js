import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="py-20 px-6 relative">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                >
                    About Me
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-lg dark:text-gray-300 text-gray-700 mb-6 leading-relaxed">
                            I'm a passionate software engineering intern with a strong foundation in modern web technologies.
                            Currently pursuing my Higher Diploma in Software Engineering at ICBT Campus while gaining hands-on experience through internships
                            and personal projects.
                        </p>
                        <p className="text-lg dark:text-gray-300 text-gray-700 mb-8 leading-relaxed">
                            I love solving complex problems, learning new technologies, and contributing to meaningful projects.
                            My goal is to build user-centric applications that make a positive impact.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['Problem Solving', 'Team Collaboration', 'Agile Development', 'Code Review'].map((skill, index) => (
                                <motion.span
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="px-4 py-2 dark:bg-gray-800 bg-white rounded-full text-sm dark:border-gray-700 border-gray-200 shadow-sm"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl transform rotate-3 opacity-20 blur-lg"></div>
                        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                            <h3 className="text-2xl font-semibold mb-6">Quick Facts</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span className="text-gray-600 dark:text-gray-300">Based in Sri Lanka</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                    <span className="text-gray-600 dark:text-gray-300">Open to Freelance Work</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                                    <span className="text-gray-600 dark:text-gray-300">Full Stack Developer</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span className="text-gray-600 dark:text-gray-300">Always Learning</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
