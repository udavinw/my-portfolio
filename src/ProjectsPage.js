import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Github, ExternalLink, Star, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from './services/api';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

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
    image: p.imageUrl || p.image || '',
    featured: p.featured || false,
  }));

  return (
    <>
      <Helmet>
        <title>All Projects - Udavin Wijesundara</title>
        <meta name="description" content="View all web development projects by Udavin Wijesundara" />
      </Helmet>
      
      <div className={`min-h-screen bg-gradient-to-br ${darkMode ? 'from-gray-900 via-blue-900/20 to-purple-900/20' : 'from-gray-50 via-blue-50 to-purple-50'}`}>
        {/* Navigation Bar */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? `${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : 'bg-transparent'
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
                      className={`capitalize transition-colors duration-300 hover:text-blue-400 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <div className={`md:hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <div className="flex flex-col space-y-4 px-6 py-4">
                {['home', 'about', 'experience', 'education', 'projects', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`capitalize text-left py-2 transition-colors duration-300 hover:text-blue-400 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
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
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              A complete collection of my web development projects
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : normalizedProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>No projects found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {normalizedProjects.map((project, index) => (
                <div
                  key={`${project.title}-${index}`}
                  className={`${darkMode ? 'bg-gray-900/60 border-gray-700 hover:border-gray-600' : 'bg-white/60 border-gray-200 hover:border-gray-400'} rounded-xl overflow-hidden transition-all duration-300 group relative backdrop-blur-sm`}
                >
                  {project.featured && (
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-lg">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.image}
                      alt={`${project.title} - Web Development Project by Udavin Wijesundara`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      width="400"
                      height="192"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={(e) => {
                        e.target.src = '/logo512.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 relative">
                    <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'} group-hover:text-blue-400 transition-colors duration-300`}>
                      {project.title}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 text-sm leading-relaxed`}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs border border-blue-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}
                        >
                          <Github size={16} className="mr-1" />
                          Code
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}
                        >
                          <ExternalLink size={16} className="mr-1" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
