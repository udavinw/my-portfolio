import React from 'react';
import { Github, Linkedin, Mail, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        { icon: <Github size={20} />, url: "https://github.com/udavinw", name: "GitHub" },
        { icon: <Linkedin size={20} />, url: "https://www.linkedin.com/in/udavin-wijesundara/", name: "LinkedIn" },
        { icon: <Instagram size={20} />, url: "https://www.instagram.com/udavin_wijesundara/", name: "Instagram" },
        { icon: <Facebook size={20} />, url: "https://www.facebook.com/udavin.wijesundara", name: "Facebook" },
        { icon: <Mail size={20} />, url: "mailto:hello@udavinwijesundara.com", name: "Email" }
    ];

    return (
        <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                            Udavin Wijesundara
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Building the future, one line of code at a time.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300 hover:-translate-y-1"
                                aria-label={social.name}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Udavin Wijesundara. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
