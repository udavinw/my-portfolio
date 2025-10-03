import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Github, Linkedin, Mail, ExternalLink, Code, Briefcase, User, Download, ChevronDown, Star, Moon, Sun, Menu, X, Twitter, Instagram, Facebook } from 'lucide-react';
import { 
  Code2, 
  FileText, 
  Palette, 
  ReactIcon,
  Server, 
  Database, 
  GitBranch,
  FileCode,
  ArrowUp

} from "lucide-react";
import profilePhoto from './assets/profile.jpg';
import resumePDF from './resume.pdf';
import { projectsAPI, experienceAPI, educationAPI, testimonialsAPI } from './services/api';


const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadError, setLoadError] = useState('');
  const cursorRef = useRef(null);

  const monthToIndex = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  const parseStartDateFromDuration = (duration) => {
    if (!duration || typeof duration !== 'string') return new Date(0);
    const firstPart = duration.split('-')[0].trim();
    const lower = firstPart.toLowerCase();
    const yearMatch = lower.match(/(\d{4})/);
    const monthMatch = lower.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;
    const month = monthMatch ? monthToIndex[monthMatch[1]] : 0;
    if (!year) return new Date(0);
    return new Date(year, month, 1);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'experience', 'education', 'projects', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setLoadError('');
        const [projectsRes, experienceRes, educationRes, testimonialsRes] = await Promise.all([
          projectsAPI.getAll(),
          experienceAPI.getAll(),
          educationAPI.getAll(),
          testimonialsAPI.getAll(),
        ]);

        const projectsRaw = [...(projectsRes.data || [])].sort((a, b) => {
          const dateDiff = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          if (dateDiff !== 0) return dateDiff;
          return String(a.title || '').localeCompare(String(b.title || ''));
        });
        const expRaw = [...(experienceRes.data || [])].sort((a, b) => {
          const da = parseStartDateFromDuration(a.duration);
          const db = parseStartDateFromDuration(b.duration);
          return db - da;
        });
        const eduRaw = [...(educationRes.data || [])].sort((a, b) => {
          const da = parseStartDateFromDuration(a.duration);
          const db = parseStartDateFromDuration(b.duration);
          return db - da;
        });
        const testiRaw = [...(testimonialsRes.data || [])].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

        const normalizedProjects = projectsRaw.map((p) => ({
          title: p.title,
          description: p.description,
          tech: Array.isArray(p.tech)
            ? p.tech
            : (typeof p.tech === 'string' ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : []),
          github: p.github,
          live: p.live,
          image: p.imageUrl || p.image || '',
        }));

        setProjects(normalizedProjects);
        setExperiences(expRaw);
        setEducations(eduRaw);
        setTestimonials(testiRaw);
      } catch (err) {
        console.error('Failed to load portfolio data', err);
        setLoadError('Failed to load latest data. Showing static fallback where available.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.top = `${e.clientY}px`;
        cursorRef.current.style.left = `${e.clientX}px`;
      }
    };
    
    document.addEventListener('mousemove', moveCursor);
    return () => document.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fallbackProjects = [
    {
      title: "Tourism Website For Truelanka Experience",
      description: "A website for Tourism, a tour and travel company in Sri Lanka. The website is built using php. The website has features like user authentication, tour booking, tour listing, and user profile.",
      tech: ["PHP", "MySQL", "HTML", "CSS", "JavaScript","Tailwind CSS"],
      github: "#",
      live: "https://truelankaexperience.com/",
      image: "/logo512.png"
    }
  ];

  const socialLinks = [
    { icon: <Github size={24} />, url: "https://github.com/udavinw", name: "GitHub" },
    { icon: <Linkedin size={24} />, url: "https://www.linkedin.com/in/udavin-wijesundara/", name: "LinkedIn" },
    { icon: <Instagram size={24} />, url: "https://www.instagram.com/udavin_wijesundara/", name: "Instagram" },
    { icon: <Facebook size={24} />, url: "https://www.facebook.com/udavin.wijesundara", name: "Facebook" },
    { icon: <Mail size={24} />, url: "mailto:hello@udavinwijesundara.com", name: "Email" }
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden transition-colors duration-300">
      <Helmet>
        <title>Udavin Wijesundara — Full Stack Developer</title>
        <link rel="canonical" href="https://udavinwijesundara.com/" />
        <meta name="description" content="Udavin Wijesundara — Full Stack Developer portfolio showcasing React, Node.js, PHP/Laravel projects, skills, and experience. Available for opportunities." />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Udavin Wijesundara" />
        <meta property="og:title" content="Udavin Wijesundara — Full Stack Developer" />
        <meta property="og:description" content="Portfolio of a full stack developer specializing in React, Node.js and Laravel. Explore projects, experience, and contact details." />
        <meta property="og:url" content="https://udavinwijesundara.com/" />
        <meta property="og:image" content="/logo512.png" />
        <meta property="og:image:alt" content="Udavin Wijesundara portfolio preview" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Udavin Wijesundara — Full Stack Developer" />
        <meta name="twitter:description" content="Portfolio of a full stack developer specializing in React, Node.js and Laravel." />
        <meta name="twitter:image" content="/logo512.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Udavin Wijesundara',
          url: 'https://udavinwijesundara.com/',
          jobTitle: 'Full Stack Developer',
          description: 'Software Engineer specializing in React, Node.js, PHP, Laravel, and MySQL. Available for web development opportunities.',
          image: 'https://udavinwijesundara.com/profile.jpg',
          worksFor: {
            '@type': 'Organization',
            name: 'Enigma Solutions Pvt Ltd'
          },
          alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'ICBT Campus'
          },
          knowsAbout: ['JavaScript', 'React', 'Node.js', 'PHP', 'Laravel', 'MySQL', 'HTML', 'CSS', 'Web Development', 'Software Engineering'],
          sameAs: [
            'https://github.com/udavinw',
            'https://www.linkedin.com/in/udavin-wijesundara/',
            'https://www.instagram.com/udavin_wijesundara/',
            'https://www.facebook.com/udavin.wijesundara'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'hello@udavinwijesundara.com',
            contactType: 'professional'
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'LK'
          }
        })}</script>
      </Helmet>
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 198, 198, 0.3) 0%, transparent 50%),
              linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 25%, rgba(236, 72, 153, 0.1) 50%, rgba(251, 146, 60, 0.1) 75%, rgba(34, 197, 94, 0.1) 100%)
            `,
            animation: 'gradientShift 15s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              conic-gradient(from 0deg at 50% 50%, rgba(59, 130, 246, 0.2) 0deg, rgba(147, 51, 234, 0.2) 60deg, rgba(236, 72, 153, 0.2) 120deg, rgba(251, 146, 60, 0.2) 180deg, rgba(34, 197, 94, 0.2) 240deg, rgba(59, 130, 246, 0.2) 300deg, rgba(59, 130, 246, 0.2) 360deg)
            `,
            animation: 'rotate 30s linear infinite'
          }}
        />
        
        <div className="absolute inset-0 dark:bg-gray-900/80 bg-gray-50/80" />
        
        <div className="absolute inset-0">
          <div 
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
            style={{
              top: '20%',
              left: '10%',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-2 h-2 bg-purple-400/40 rounded-full"
            style={{
              top: '60%',
              left: '80%',
              animation: 'float 8s ease-in-out infinite reverse'
            }}
          />
          <div 
            className="absolute w-1 h-1 bg-pink-400/40 rounded-full"
            style={{
              top: '80%',
              left: '20%',
              animation: 'float 10s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-2 h-2 bg-green-400/40 rounded-full"
            style={{
              top: '30%',
              left: '70%',
              animation: 'float 7s ease-in-out infinite reverse'
            }}
          />
          <div 
            className="absolute w-1 h-1 bg-yellow-400/40 rounded-full"
            style={{
              top: '50%',
              left: '40%',
              animation: 'float 9s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      <div className="relative z-10 text-gray-900 dark:text-white">
        
        <div 
          ref={cursorRef}
          className="fixed w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-100 ease-out"
        />

        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'dark:bg-gray-900/95 bg-white/95 backdrop-blur-sm border-b dark:border-gray-700 border-gray-200' : 'bg-transparent'
        }`}>
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Udavin Wijesundara
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex space-x-8">
                  {['home', 'about', 'experience', 'education', 'projects', 'contact'].map((section) => (
                    <button
                      key={section}
                      onClick={() => scrollToSection(section)}
                      className={`capitalize transition-colors duration-300 hover:text-blue-400 relative ${
                        activeSection === section ? 'text-blue-400' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {section}
                      {activeSection === section && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="md:hidden p-2 rounded-full dark:bg-gray-800 bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <div className="md:hidden dark:bg-gray-900 bg-white">
              <div className="flex flex-col space-y-4 px-6 py-4">
                {['home', 'about', 'experience', 'education', 'projects', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`capitalize text-left py-2 transition-colors duration-300 hover:text-blue-400 ${
                      activeSection === section ? 'text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

  <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-20">
    {/* Animated background grid */}
    <div className="absolute inset-0 opacity-20 dark:opacity-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20"></div>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-300 dark:text-blue-700"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    {/* Floating geometric shapes */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-32 right-20 w-1 h-1 bg-purple-500 rounded-full animate-ping opacity-40"></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-30"></div>
      <div className="absolute bottom-20 right-32 w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-50"></div>
    </div>

    <div className="relative z-10 px-6 w-full max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <div className="order-2 lg:order-1 text-center lg:text-left space-y-8">
          {/* Role Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800/30 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available for opportunities</span>
          </div>

          {/* Main Heading */}
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

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            Passionate about crafting elegant solutions and pushing the boundaries of what's possible with code. 
            Currently building the future, one line at a time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => scrollToSection('projects')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                Explore My Work
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            <button 
              onClick={() => window.open(resumePDF, '_blank')}
              className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-semibold transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg backdrop-blur-sm"
            >
              <span className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <Download size={20} className="transition-transform group-hover:scale-110" />
                Download Resume
              </span>
            </button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center lg:justify-start items-center gap-6 pt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Connect with me:</span>
            <div className="flex gap-4">
              {socialLinks.slice(0, 4).map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm"
                  aria-label={social.name}
                >
                  <div className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-1 animate-spin-slow">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
            </div>
            
            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              {/* Main image container */}
              <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
                  <img 
                    src={profilePhoto} 
                    alt="Udavin Wijesundara - Full Stack Developer and Software Engineer" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="eager"
                    width="384"
                    height="384"
                    sizes="(max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none"></div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-xl border border-gray-100 dark:border-gray-700 animate-float">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-xl border border-gray-100 dark:border-gray-700 animate-float-delay">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">💻 Developer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Enhanced scroll indicator */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="flex flex-col items-center animate-bounce">
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-2 animate-pulse">Scroll to explore</span>
        <div className="p-2 rounded-full border-2 border-gray-300 dark:border-gray-600">
          <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    </div>

    <style jsx>{`
      @keyframes gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes float-delay {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      
      .animate-gradient {
        background-size: 200% 200%;
        animation: gradient 3s ease infinite;
      }
      
      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      .animate-float-delay {
        animation: float-delay 3s ease-in-out infinite 1.5s;
      }
    `}</style>
  </section>
        {/* About Section */}
        <section id="about" className="py-20 px-6 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              About Me - Full Stack Developer & Software Engineer
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side - About */}
              <div>
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
                  {['Problem Solving', 'Team Collaboration', 'Agile Development', 'Code Review'].map((skill) => (
                    <span 
                      key={skill} 
                      className="px-4 py-2 dark:bg-gray-800/60 bg-gray-100 rounded-full text-sm dark:border-gray-700 border-gray-200 backdrop-blur-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Side - Skills */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">Technical Skills</h3>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {[
                      { name: "JavaScript", level: 90 },
                      { name: "React", level: 80 },
                      { name: "Node.js", level: 80 },
                      { name: "Express.js", level: 80 },
                      { name: "MongoDB", level: 80 },
                      { name: "MySQL", level: 80 },
                      { name: "Laravel", level: 75 },
                    ].map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-2">
                          <span className="dark:text-gray-300 text-gray-700">{skill.name}</span>
                          <span className="dark:text-gray-400 text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full dark:bg-gray-700/50 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {[
                      { name: "C++", level: 50 },
                      { name: "HTML", level: 95 },
                      { name: "CSS", level: 90 },
                      { name: "Tailwind CSS", level: 90 },
                      { name: "PHP", level: 85 },
                      { name: "Git", level: 85 },
                    ].map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-2">
                          <span className="dark:text-gray-300 text-gray-700">{skill.name}</span>
                          <span className="dark:text-gray-400 text-gray-600">{skill.level}%</span>
                        </div>
                        <div className="w-full dark:bg-gray-700/50 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Experience Section */}
        <section id="experience" className="py-20 px-6 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Professional Experience - Web Development & Software Engineering
            </h2>
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                  <div className="p-3 rounded-full dark:bg-gray-700/60 bg-gray-200 backdrop-blur-sm">
                      <Briefcase size={20} className="text-blue-400" />
                    </div>
                    {index !== experiences.length - 1 && (
                      <div className="w-0.5 h-full dark:bg-gray-600 bg-gray-300 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold dark:text-white text-gray-800">{exp.role}</h3>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-lg font-medium dark:text-blue-400 text-blue-600">{exp.company}</span>
                      <span className="dark:text-gray-400 text-gray-600">{exp.duration}</span>
                    </div>
                    <p className="dark:text-gray-300 text-gray-700 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-20 px-6 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Education - Software Engineering & Computing
            </h2>
            
            <div className="space-y-12">
              {educations.map((edu, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full dark:bg-gray-700/60 bg-gray-200 backdrop-blur-sm">
                      <User size={20} className="text-green-400" />
                    </div>
                    {index !== educations.length - 1 && (
                      <div className="w-0.5 h-full dark:bg-gray-600 bg-gray-300 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold dark:text-white text-gray-800">{edu.degree}</h3>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-lg font-medium dark:text-blue-400 text-blue-600">{edu.institution}</span>
                      <span className="dark:text-gray-400 text-gray-600">{edu.duration}</span>
                    </div>
                    <ul className="dark:text-gray-300 text-gray-700 list-disc pl-5 space-y-1">
                      {(edu.achievements || []).map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-6 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Featured Projects - Web Development Portfolio
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(projects.length ? projects : fallbackProjects).map((project, index) => (
                <div
                  key={project.title}
                  className="dark:bg-gray-900/60 bg-white/60 rounded-xl overflow-hidden dark:border-gray-700 border-gray-200 hover:dark:border-gray-600 hover:border-gray-400 transition-all duration-300 group relative backdrop-blur-sm"
                >
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
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 relative">
                    <h3 className="text-xl font-semibold mb-3 dark:text-white text-gray-800 group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="dark:text-gray-400 text-gray-600 mb-4 text-sm leading-relaxed">
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
                      {/* <a
                        href={project.github}
                        className="flex items-center dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-black transition-colors duration-300"
                      >
                        <Github size={16} className="mr-1" />
                        Code
                      </a> */}
                      <a
                        href={project.live} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-black transition-colors duration-300"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        Live Demo
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {testimonials && testimonials.length > 0 && (
          <section id="testimonials" className="py-20 px-6 relative">
            <div className="max-w-6xl mx-auto relative z-10">
              <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Testimonials
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="dark:bg-gray-800/60 bg-gray-100/60 rounded-xl p-8 border dark:border-gray-700 border-gray-200 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold dark:text-white text-gray-800">
                          {testimonial.name}
                        </h4>
                        <p className="dark:text-gray-400 text-gray-600 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className="dark:text-gray-300 text-gray-700 italic">
                      "{testimonial.feedback}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Contact - Get In Touch With Full Stack Developer
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Contact Info Cards */}
            <div className="space-y-6">
              <div className="dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm p-6 rounded-xl border dark:border-gray-700 border-gray-200 hover:dark:bg-gray-800/70 hover:bg-white/70 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-gray-300 text-gray-700 mb-1">Email</h4>
                    <a href="mailto:hello@udavinwijesundara.com" target="_blank" rel="noopener noreferrer" className="dark:text-gray-400 text-gray-600 hover:text-blue-500 transition-colors text-sm">
                      hello@udavinwijesundara.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm p-6 rounded-xl border dark:border-gray-700 border-gray-200 hover:dark:bg-gray-800/70 hover:bg-white/70 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-full text-purple-400">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-gray-300 text-gray-700 mb-1">LinkedIn</h4>
                    <a href="https://www.linkedin.com/in/udavin-wijesundara/" target="_blank" rel="noopener noreferrer" className="dark:text-gray-400 text-gray-600 hover:text-blue-500 transition-colors text-sm">
                      linkedin.com/in/udavin-wijesundara
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm p-6 rounded-xl border dark:border-gray-700 border-gray-200 hover:dark:bg-gray-800/70 hover:bg-white/70 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-full text-green-400">
                    <Code size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-gray-300 text-gray-700 mb-1">GitHub</h4>
                    <a href="https://github.com/udavinw" target="_blank" rel="noopener noreferrer" className="dark:text-gray-400 text-gray-600 hover:text-blue-500 transition-colors text-sm">
                      github.com/udavinw
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Social Links and CTA */}
            <div className="dark:bg-gray-800/50 bg-white/50 backdrop-blur-sm p-8 rounded-xl border dark:border-gray-700 border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-4 dark:text-gray-300 text-gray-700">Let's Connect</h3>
                <p className="dark:text-gray-400 text-gray-600 mb-6">
                  I'm always open to discussing new opportunities, creative projects, or just having a chat about technology and innovation.
                </p>
              </div>
              
              <div className="mb-8">
                <h4 className="font-medium dark:text-gray-300 text-gray-700 mb-6 text-center">Find me on social media</h4>
                <div className="flex justify-center flex-wrap gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-full dark:bg-gray-700/60 bg-gray-200/60 backdrop-blur-sm flex items-center justify-center dark:text-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="text-center pt-6 border-t dark:border-gray-700 border-gray-200">
                <div className="inline-flex items-center gap-2 dark:text-gray-400 text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Available for new opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Footer */}
        <footer className="relative z-10 dark:bg-gray-900/95 bg-white/95 backdrop-blur-sm border-t dark:border-gray-700 border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Brand */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Udavin Wijesundara
              </h3>
              <p className="text-sm dark:text-gray-400 text-gray-600">
                Full-Stack Developer & Tech Enthusiast
              </p>
            </div>
            
            {/* Center Column - Quick Links */}
            <div className="text-center">
              <h4 className="font-medium dark:text-gray-300 text-gray-700 mb-3">Quick Links</h4>
              <div className="flex justify-center space-x-6 text-sm">
                <a href="#about" className="dark:text-gray-400 text-gray-600 hover:text-blue-500 transition-colors">
                  About
                </a>
                <a href="#projects" className="dark:text-gray-400 text-gray-600 hover:text-blue-500 transition-colors">
                  Projects
                </a>
                <a href="#contact" className="dark:text-gray-400 text-gray-600 hover:text-blue-500 transition-colors">
                  Contact
                </a>
              </div>
            </div>
            
            {/* Right Column - Social Links */}
            <div className="text-center md:text-right">
              <h4 className="font-medium dark:text-gray-300 text-gray-700 mb-3">Connect</h4>
              <div className="flex justify-center md:justify-end space-x-3">
                {socialLinks.slice(0, 4).map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full dark:bg-gray-800/60 bg-gray-200/60 backdrop-blur-sm flex items-center justify-center dark:text-gray-400 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-300 text-sm"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t dark:border-gray-700 border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm dark:text-gray-400 text-gray-600">
              <p>
                &copy; {new Date().getFullYear()} Udavin Wijesundara. All rights reserved.
              </p>
              
              <div className="flex items-center gap-1">
                <span>Built with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>using</span>
                <div className="flex items-center gap-2 ml-2">
                  <span className="px-2 py-1 rounded dark:bg-blue-500/10 bg-blue-100 text-blue-500 text-xs font-medium">
                    React
                  </span>
                  <span className="px-2 py-1 rounded dark:bg-cyan-500/10 bg-cyan-100 text-cyan-500 text-xs font-medium">
                    Tailwind
                  </span>
                  <span className="px-2 py-1 rounded dark:bg-purple-500/10 bg-purple-100 text-purple-500 text-xs font-medium">
                    Framer Motion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl flex items-center justify-center hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 backdrop-blur-sm animate-pulse-slow z-50"
            aria-label="Back to top"
          >
            <ArrowUp size={24} className="transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        )}
      </footer>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translateY(-10px) translateX(5px) scale(1.02);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-5px) translateX(-8px) scale(0.98);
            opacity: 1;
          }
          75% {
            transform: translateY(8px) translateX(3px) scale(1.01);
            opacity: 0.85;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-15px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        .animate-gradient-shift {
          animation: gradientShift 15s ease-in-out infinite;
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;