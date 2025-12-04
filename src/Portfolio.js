import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Background from './components/Background';
import Preloader from './Preloader';
import Services from './components/Services';

const Portfolio = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'experience', 'education', 'projects', 'skills', 'contact'];
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-gray-900 dark:text-white transition-colors duration-300">
      <Helmet>
        <title>Udavin Wijesundara — Full Stack Developer</title>
        <meta name="description" content="Udavin Wijesundara — Full Stack Developer portfolio showcasing React, Node.js, PHP/Laravel projects, skills, and experience." />
      </Helmet>

      <Background />
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />

      <main>
        <Hero scrollToSection={scrollToSection} />
        <About />
        <Services />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;