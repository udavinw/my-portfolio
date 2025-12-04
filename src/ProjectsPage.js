import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Github, ExternalLink, Star, Menu, X, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { projectsAPI } from './services/api';
import Background from './components/Background';

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
        {/* Lid (Screen) */}
        <div className="bg-[#f0f0f0] rounded-t-xl p-[3%] pb-0 shadow-2xl relative z-10 border border-gray-300">
          {/* Camera Dot */}
          <div className="absolute top-[1.5%] left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full z-20"></div>

          {/* Screen Container */}
          <div className="bg-black rounded-t-md overflow-hidden aspect-video relative border-[1px] border-gray-300">
            {/* Scrolling Image */}
            <img
              src={project.image}
              alt={`${project.title} - Web Development Project by Udavin Wijesundara`}
              className="w-full h-full object-cover object-top transition-all duration-[5000ms] ease-in-out group-hover:object-bottom"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/logo512.png';
              }}
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

        {/* Base (Bottom) */}
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
          {project.tech.map((tech, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded-md font-medium border border-blue-800/30"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    navigate(`/#${sectionId}`);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getAll();
        setProjects(response.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const normalizedProjects = projects.map((p) => ({
    title: p.title,
    description: p.description,
    tech: Array.isArray(p.tech)
      ? p.tech
      : (typeof p.tech === 'string' ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : []),
    github: p.github,
    live: p.live,
    youtubeUrl: p.youtubeUrl,
    image: p.imageUrl || p.image || '',
    featured: p.featured || false,
  }));

  return (
    <>
      <Helmet>
        <title>All Projects - Udavin Wijesundara</title>
        <meta name="description" content="View all web development projects by Udavin Wijesundara" />
      </Helmet>

      <Background />

      <div className="min-h-screen text-white">
        {/* Navigation Bar */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-sm border-b border-gray-700' : 'bg-transparent'
          }`}>
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/')}
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Udavin Wijesundara
              </button>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex space-x-8">
                  {['home', 'about', 'experience', 'education', 'projects', 'contact'].map((section) => (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className="capitalize transition-colors duration-300 hover:text-blue-400 text-gray-300"
                    >
                      {section}
                    </button>
                  ))}
                </div>

                <button
                  className="md:hidden p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-gray-900">
              <div className="flex flex-col space-y-4 px-6 py-4">
                {['home', 'about', 'experience', 'education', 'projects', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="capitalize text-left py-2 transition-colors duration-300 hover:text-blue-400 text-gray-300"
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-20 pt-32">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              All Projects
            </h1>
            <p className="text-lg text-gray-400">
              A complete collection of my web development projects
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : normalizedProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No projects found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {normalizedProjects.map((project, index) => (
                <ProjectCard key={`${project.title}-${index}`} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
