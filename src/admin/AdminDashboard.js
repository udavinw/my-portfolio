import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Briefcase, 
  GraduationCap, 
  MessageSquare, 
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
import { dashboardAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [stats, setStats] = useState({
    projects: 0,
    experiences: 0,
    education: 0,
    testimonials: 0
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
          testimonials: 0
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
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'text-purple-500' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'text-orange-500' },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, color: 'text-pink-500' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-indigo-500' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardStats stats={stats} loading={statsLoading} />;
      case 'projects':
        return <ProjectsManagement />;
      case 'experience':
        return <ExperienceManagement />;
      case 'education':
        return <EducationManagement />;
      case 'testimonials':
        return <TestimonialsManagement />;
      case 'profile':
        return <ProfileManagement />;
      default:
        return <DashboardStats stats={stats} loading={statsLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ x: isDesktop ? 0 : (sidebarOpen ? 0 : -280) }}
          className="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl lg:translate-x-0 lg:static lg:inset-0"
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
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 to-blue-50/50">
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
    </div>
  );
};

export default AdminDashboard;
