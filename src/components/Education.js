import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { educationAPI } from '../services/api';

const Education = () => {
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await educationAPI.getAll();
                const sortedEducation = (response.data || []).sort((a, b) => (a.order || 0) - (b.order || 0));
                setEducations(sortedEducation);
            } catch (error) {
                console.error('Error fetching education:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEducation();
    }, []);

    return (
        <section id="education" className="py-20 px-6 relative">
            <div className="max-w-4xl mx-auto relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                >
                    Education
                </motion.h2>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {educations.map((edu, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-6 group"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 group-hover:border-green-500 dark:group-hover:border-green-400 transition-colors duration-300">
                                        <GraduationCap size={20} className="text-green-500 dark:text-green-400" />
                                    </div>
                                    {index !== educations.length - 1 && (
                                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2 group-hover:bg-green-200 dark:group-hover:bg-green-900 transition-colors duration-300"></div>
                                    )}
                                </div>
                                <div className="flex-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
                                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">{edu.degree}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm">
                                        <span className="font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                            {edu.institution}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            {edu.duration}
                                        </span>
                                    </div>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                                        {(edu.achievements || []).map((achievement, i) => (
                                            <li key={i}>{achievement}</li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Education;
