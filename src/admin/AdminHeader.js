import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Search, 
  User, 
  LogOut, 
  ChevronDown
} from 'lucide-react';
import { authAPI } from '../services/api';

const AdminHeader = ({ onMenuClick, activeSection, navigationItems, setActiveSection }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@portfolio.com' });
  const [userLoading, setUserLoading] = useState(true);
  const dropdownRef = useRef(null);

  const currentSection = navigationItems.find(item => item.id === activeSection);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const token = localStorage.getItem('token');
        const userDataString = localStorage.getItem('userData');
        
        console.log('Token found:', !!token); // Debug log
        console.log('User data found:', !!userDataString); // Debug log
        
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            console.log('User data from localStorage:', userData); // Debug log
            setUser({
              name: userData.name || 'Admin User',
              email: userData.email || 'admin@portfolio.com'
            });
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            decodeTokenForUserData(token);
          }
        } else if (token) {
          decodeTokenForUserData(token);
        } else {
          console.log('No token or user data found');
          setUser({ name: 'Admin User', email: 'admin@portfolio.com' });
        }
        
        async function decodeTokenForUserData(token) {
          try {
            // Decode JWT token
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              console.log('Decoded payload:', payload); // Debug log
              
              // Check if we have user info in the token
              if (payload.name && payload.email) {
                setUser({
                  name: payload.name,
                  email: payload.email
                });
              } else {
                // Try to get user info from API if not in token
                try {
                  const response = await authAPI.verifyToken();
                  if (response.data) {
                    // If verifyToken returns user data, use it
                    setUser({
                      name: response.data.name || 'Admin User',
                      email: response.data.email || 'admin@portfolio.com'
                    });
                  } else {
                    setUser({ name: 'Admin User', email: 'admin@portfolio.com' });
                  }
                } catch (apiError) {
                  console.error('Error fetching user from API:', apiError);
                  setUser({ name: 'Admin User', email: 'admin@portfolio.com' });
                }
              }
            } else {
              console.error('Invalid token format');
              setUser({ name: 'Admin User', email: 'admin@portfolio.com' });
            }
          } catch (error) {
            console.error('Error decoding token:', error);
            setUser({ name: 'Admin User', email: 'admin@portfolio.com' });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({ name: 'Admin User', email: 'admin@portfolio.com' });
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/admin/login';
  };

  const handleProfileClick = () => {
    setActiveSection('profile');
    setShowUserMenu(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-lg sticky top-0 z-30">
      <div className="px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-white flex items-center gap-3 drop-shadow">
                {currentSection && (
                  <>
                    <currentSection.icon className={`w-6 h-6 ${currentSection.color}`} />
                    {currentSection.label}
                  </>
                )}
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                Manage your portfolio content
              </p>
            </div>
          </div>

          {/* Center - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, experiences..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* User menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  {userLoading ? (
                    <div className="space-y-1">
                      <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-white/20 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-300">{user.email}</p>
                    </>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-300" />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-xl shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-white/20">
                    {userLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-white/20 rounded animate-pulse"></div>
                        <div className="h-3 w-32 bg-white/20 rounded animate-pulse"></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-300">{user.email}</p>
                      </>
                    )}
                  </div>
                  
                  <div className="py-2">
                    <button 
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-white/10 flex items-center gap-3 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile Settings
                    </button>
                    <div className="border-t border-white/20 my-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
