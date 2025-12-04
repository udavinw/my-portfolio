import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, Youtube, Star } from 'lucide-react';
import { projectsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, index }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="group perspective-1000"
        >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            {/* MacBook Structure */}
            <div className="relative w-full max-w-lg mx-auto transform transition-transform duration-300 group-hover:scale-105">
                {/* Lid (Screen) - White Frame */}
                <div className="bg-[#f0f0f0] rounded-t-xl p-[3%] pb-0 shadow-2xl relative z-10 border border-gray-300">
                    {/* Camera Dot */}
                    <div className="absolute top-[1.5%] left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full z-20"></div>

                    {/* Screen Container */}
                    <div className="bg-black rounded-t-md overflow-hidden aspect-video relative border-[1px] border-gray-300">
                        {/* Scrolling Image */}
                        <img
                            src={project.imageUrl || project.image || '/logo512.png'}
                            alt={project.title}
                            className="w-full h-full object-cover object-top transition-all duration-[5000ms] ease-in-out group-hover:object-bottom"
                            onError={(e) => { e.target.src = '/logo512.png'; }}
                        />

                        {/* Overlay for Links */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all border border-white/10"
                                    title="View Code"
                                >
                                    <Github size={20} />
                                </a>
                            )}
                            {project.live && (
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all border border-white/10"
                                    title="Live Demo"
                                >
                                    <ExternalLink size={20} />
                                </a>
                            )}
                            {project.youtubeUrl && (
                                <a
                                    href={project.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all border border-white/10"
                                    title="Watch Demo"
                                >
                                    <Youtube size={20} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Base (Bottom) - White Frame */}
                <div className="bg-[#e0e0e0] h-3 rounded-b-xl shadow-xl relative z-20 flex justify-center border-t border-gray-300">
                    {/* Opener Notch */}
                    <div className="w-[15%] h-1 bg-[#d0d0d0] rounded-b-md"></div>
                </div>

                {/* Reflection */}
                <div className="absolute -bottom-10 left-4 right-4 h-8 bg-black/20 blur-xl rounded-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Project Info - Fixed Height Container */}
            <div className="text-center mt-8 px-4">
                <div className="h-16 flex items-start justify-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        {project.title}
                        {project.featured && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                    </h3>
                </div>

                <div className="h-20 overflow-hidden mb-4">
                    <p className="text-gray-400 text-sm line-clamp-3 max-w-md mx-auto">
                        {project.description}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 h-16 content-start">
                    {(Array.isArray(project.tech) ? project.tech : (project.tech || '').split(',')).map((tech, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded-md font-medium border border-blue-800/30"
                        >
                            {typeof tech === 'string' ? tech.trim() : tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectsAPI.getAll();
                const allProjects = response.data || [];
                const featured = allProjects.filter(p => p.featured);
                setProjects(featured.length > 0 ? featured : allProjects.slice(0, 6));
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <section id="projects" className="py-20 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                    >
                        Featured Projects
                    </motion.h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        A selection of my recent work. Check out the full portfolio for more.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-12">
                            {projects.map((project, index) => (
                                <ProjectCard key={project._id || index} project={project} index={index} />
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <button
                                onClick={() => navigate('/projects')}
                                className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md"
                            >
                                View All Projects
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Projects;
