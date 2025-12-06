import React from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Database, Server, Globe } from 'lucide-react';

const Services = () => {
    const services = [
        {
            icon: <Code size={32} />,
            title: "Web Development",
            description: "Building responsive, high-performance websites and web applications using modern technologies like React, Next.js, and Node.js."
        },
        {
            icon: <Server size={32} />,
            title: "Backend Development",
            description: "Developing robust and scalable server-side logic, APIs, and database architectures to power your applications."
        },
        {
            icon: <Database size={32} />,
            title: "Database Management",
            description: "Designing and optimizing database schemas to ensure efficient data storage, retrieval, and integrity."
        },
        {
            icon: <Globe size={32} />,
            title: "Full Stack Solutions",
            description: "Providing end-to-end development services, handling both frontend and backend aspects of your project."
        },
        {
            icon: <Smartphone size={32} />,
            title: "Mobile App Development",
            description: "Creating cross-platform mobile applications that provide seamless user experiences on both iOS and Android devices."
        }
    ];

    return (
        <section id="services" className="py-20 px-6 relative">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                >
                    Services I Offer
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
