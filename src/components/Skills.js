import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skillsAPI } from '../services/api';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await skillsAPI.getAll();
                setSkills(response.data || []);
            } catch (error) {
                console.error('Error fetching skills:', error);
                // Fallback skills if backend fails or is empty
                setSkills([
                    { name: "JavaScript", level: 90, category: "Frontend" },
                    { name: "React", level: 85, category: "Frontend" },
                    { name: "Node.js", level: 80, category: "Backend" },
                    { name: "MongoDB", level: 80, category: "Backend" },
                    { name: "HTML/CSS", level: 95, category: "Frontend" },
                    { name: "Tailwind CSS", level: 90, category: "Frontend" },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const categories = [...new Set(skills.map(skill => skill.category))];

    return (
        <section id="skills" className="py-20 px-6 relative">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                >
                    Technical Skills
                </motion.h2>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-12">
                        {categories.map((category, catIndex) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: catIndex * 0.1 }}
                                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800"
                            >
                                <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                    {category}
                                </h3>
                                <div className="space-y-6">
                                    {skills.filter(s => s.category === category).map((skill, index) => (
                                        <div key={skill.name}>
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                                                <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${skill.level}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: index * 0.1 }}
                                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
