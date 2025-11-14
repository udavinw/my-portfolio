import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Shield } from 'lucide-react';

const AdminSidebar = ({ navigationItems, activeSection, setActiveSection, onClose }) => {
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    onClose();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white drop-shadow">Portfolio Admin</h2>
              <p className="text-xs text-gray-300">Management Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-white/20 border border-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {navigationItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                activeSection === item.id ? 'text-white' : item.color
              }`} />
              <span className="font-medium">{item.label}</span>
              {activeSection === item.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </nav>

    </div>
  );
};

export default AdminSidebar;
