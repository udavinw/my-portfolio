import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Mail,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Plus,
  BarChart3,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import DashboardStats from './DashboardStats';
import ProjectsManagement from './ProjectsManagement';
import ExperienceManagement from './ExperienceManagement';
import EducationManagement from './EducationManagement';
import TestimonialsManagement from './TestimonialsManagement';
import ProfileManagement from './ProfileManagement';
import SkillsManagement from './SkillsManagement';
import ContactManagement from './ContactManagement';
import { dashboardAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    experiences: 0,
    education: 0,
    testimonials: 0,
    skills: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const statsData = await dashboardAPI.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Fallback to default values on error
        setStats({
          projects: 0,
          experiences: 0,
          education: 0,
          testimonials: 0,
          skills: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Handle desktop detection
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, color: 'text-green-500' },
    { id: 'skills', label: 'Skills', icon: BarChart3, color: 'text-cyan-500' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'text-purple-500' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'text-orange-500' },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, color: 'text-pink-500' },
    { id: 'messages', label: 'Messages', icon: Mail, color: 'text-red-500' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-indigo-500' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardStats stats={stats} loading={statsLoading} />;
      case 'projects':
        return <ProjectsManagement />;
      case 'skills':
        return <SkillsManagement />;
      case 'experience':
        return <ExperienceManagement />;
      case 'education':
        return <EducationManagement />;
      case 'testimonials':
        return <TestimonialsManagement />;
      case 'messages':
        return <ContactManagement />;
      case 'profile':
        return <ProfileManagement />;
      default:
        return <DashboardStats stats={stats} loading={statsLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated neon floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="neon-circle top-[10%] left-[15%] w-72 h-72 bg-gradient-to-r from-purple-600 to-pink-500"></div>
        <div className="neon-circle top-[60%] right-[5%] w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-400 animation-delay-2000"></div>
        <div className="neon-circle bottom-[10%] left-[40%] w-64 h-64 bg-gradient-to-r from-indigo-500 to-purple-600 animation-delay-4000"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle animation-delay-2000"></div>
        <div className="floating-particle animation-delay-4000"></div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ x: isDesktop ? 0 : (sidebarOpen ? 0 : -280) }}
          className="fixed inset-y-0 left-0 z-50 w-72 backdrop-blur-2xl bg-white/10 border-r border-white/20 shadow-2xl lg:translate-x-0 lg:static lg:inset-0"
        >
          <AdminSidebar
            navigationItems={navigationItems}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onClose={() => setSidebarOpen(false)}
          />
        </motion.div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Header */}
          <AdminHeader
            onMenuClick={() => setSidebarOpen(true)}
            activeSection={activeSection}
            navigationItems={navigationItems}
            setActiveSection={setActiveSection}
          />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="max-w-7xl mx-auto"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        .neon-circle {
          position: absolute;
          border-radius: 9999px;
          opacity: 0.35;
          filter: blur(90px);
          animation: floatBlob 14s infinite ease-in-out;
        }
        
        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.2); }
          66% { transform: translate(-30px, 40px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .floating-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          opacity: 0.15;
          border-radius: 50%;
          animation: particleFloat 10s infinite linear;
          top: 50%;
          left: 50%;
        }

        @keyframes particleFloat {
          0% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(200px, -150px) scale(0.5); opacity: 0.05; }
          100% { transform: translate(-200px, 200px) scale(1); opacity: 0.15; }
        }

        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
