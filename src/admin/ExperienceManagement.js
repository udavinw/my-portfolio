import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building2,
  Calendar,
  MapPin,
  Award,
  MoreVertical,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { experienceAPI } from '../services/api';

const ExperienceManagement = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    duration: '',
    description: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, experienceId: null, experienceTitle: '' });

  // Fetch experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await experienceAPI.getAll();
        setExperiences(response.data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setMessage({ type: 'error', text: 'Failed to load experiences' });
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = experiences.filter(experience =>
    experience.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    experience.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    experience.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await experienceAPI.create(formData);
      setExperiences([...experiences, response.data.experience]);
      setMessage({ type: 'success', text: 'Experience added successfully!' });
      setShowAddModal(false);
      setFormData({ company: '', role: '', duration: '', description: '' });
    } catch (error) {
      console.error('Error adding experience:', error);
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to add experience' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      role: experience.role,
      duration: experience.duration,
      description: experience.description
    });
    setShowAddModal(true);
  };

  const handleDeleteExperience = (experienceId) => {
    const experience = experiences.find(exp => exp.experienceId === experienceId);
    setDeleteConfirm({ show: true, experienceId, experienceTitle: `${experience?.role} at ${experience?.company}` || 'this experience' });
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await experienceAPI.delete(deleteConfirm.experienceId);
      setExperiences(experiences.filter(exp => exp.experienceId !== deleteConfirm.experienceId));
      setMessage({ type: 'success', text: 'Experience deleted successfully!' });
      setDeleteConfirm({ show: false, experienceId: null, experienceTitle: '' });
    } catch (error) {
      console.error('Error deleting experience:', error);
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to delete experience' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExperience = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await experienceAPI.update(editingExperience.experienceId, formData);
      setExperiences(experiences.map(exp => 
        exp.experienceId === editingExperience.experienceId ? response.data.experience : exp
      ));
      setMessage({ type: 'success', text: 'Experience updated successfully!' });
      setShowAddModal(false);
      setEditingExperience(null);
      setFormData({ company: '', role: '', duration: '', description: '' });
    } catch (error) {
      console.error('Error updating experience:', error);
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to update experience' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow">Experience Management</h1>
          <p className="text-gray-300">Manage your work experience</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:scale-105 transition-all shadow-lg shadow-pink-500/30"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* Message Display */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center gap-3 backdrop-blur-sm ${
            message.type === 'success' 
              ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search experiences..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Experiences List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredExperiences.map((experience, index) => (
            <motion.div
              key={experience.experienceId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{experience.role}</h3>
                      <span className="px-2 py-1 bg-green-500/30 text-green-300 text-xs rounded-full border border-green-400/30">
                        Active
                      </span>
                    </div>
                    <p className="text-pink-400 font-medium mb-2">{experience.company}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {experience.duration}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed">{experience.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditExperience(experience)}
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/20"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(experience.experienceId)}
                    className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Experience Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-6 drop-shadow">
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </h2>

              <form onSubmit={editingExperience ? handleUpdateExperience : handleAddExperience} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Role/Position</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2022 - Present, Jan 2020 - Dec 2022"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    rows="4"
                    placeholder="Describe your responsibilities and achievements..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all shadow-lg shadow-pink-500/30"
                  >
                    {editingExperience ? 'Update Experience' : 'Add Experience'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingExperience(null);
                      setFormData({ company: '', role: '', duration: '', description: '' });
                    }}
                    className="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 border border-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setDeleteConfirm({ show: false, experienceId: null, experienceTitle: '' })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/40">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Delete Experience</h3>
                  <p className="text-gray-300 text-sm">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-semibold text-white">"{deleteConfirm.experienceTitle}"</span>? This will permanently remove the experience from your portfolio.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm({ show: false, experienceId: null, experienceTitle: '' })}
                  className="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 border border-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceManagement;
