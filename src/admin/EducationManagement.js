import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { educationAPI } from '../services/api';

const EducationManagement = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    duration: '',
    achievements: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, educationId: null, educationTitle: '' });

  // Fetch educations from API
  useEffect(() => {
    const fetchEducations = async () => {
      try {
        setLoading(true);
        const response = await educationAPI.getAll();
        setEducations(response.data);
      } catch (error) {
        console.error('Error fetching educations:', error);
        setMessage({ type: 'error', text: 'Failed to load educations' });
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();
  }, []);

  const filteredEducations = educations.filter(education =>
    education.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    education.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
    education.achievements.some(achievement => achievement.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const educationData = {
        ...formData,
        achievements: formData.achievements.split(',').map(a => a.trim()).filter(a => a)
      };
      const response = await educationAPI.create(educationData);
      setEducations([...educations, response.data.education]);
      setMessage({ type: 'success', text: 'Education added successfully!' });
      setShowAddModal(false);
      setFormData({ institution: '', degree: '', duration: '', achievements: '' });
    } catch (error) {
      console.error('Error adding education:', error);
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to add education' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditEducation = (education) => {
    setEditingEducation(education);
    setFormData({
      institution: education.institution,
      degree: education.degree,
      duration: education.duration,
      achievements: education.achievements.join(', ')
    });
    setShowAddModal(true);
  };

  const handleDeleteEducation = (educationId) => {
    const education = educations.find(edu => edu.educationId === educationId);
    setDeleteConfirm({ show: true, educationId, educationTitle: `${education?.degree} from ${education?.institution}` || 'this education entry' });
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await educationAPI.delete(deleteConfirm.educationId);
      setEducations(educations.filter(edu => edu.educationId !== deleteConfirm.educationId));
      setMessage({ type: 'success', text: 'Education deleted successfully!' });
      setDeleteConfirm({ show: false, educationId: null, educationTitle: '' });
    } catch (error) {
      console.error('Error deleting education:', error);
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to delete education' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEducation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const educationData = {
        ...formData,
        achievements: formData.achievements.split(',').map(a => a.trim()).filter(a => a)
      };
      const response = await educationAPI.update(editingEducation.educationId, educationData);
      setEducations(educations.map(edu => 
        edu.educationId === editingEducation.educationId ? response.data.education : edu
      ));
      setMessage({ type: 'success', text: 'Education updated successfully!' });
      setShowAddModal(false);
      setEditingEducation(null);
      setFormData({ institution: '', degree: '', duration: '', achievements: '' });
    } catch (error) {
      console.error('Error updating education:', error);
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to update education' });
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
          <h1 className="text-2xl font-bold text-white drop-shadow">Education Management</h1>
          <p className="text-gray-300">Manage your educational background</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:scale-105 transition-all shadow-lg shadow-pink-500/30"
        >
          <Plus className="w-4 h-4" />
          Add Education
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
            placeholder="Search education..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Education List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredEducations.map((education, index) => (
            <motion.div
              key={education.educationId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{education.degree}</h3>
                      <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs rounded-full border border-purple-400/30">
                        Completed
                      </span>
                    </div>
                    <p className="text-pink-400 font-medium mb-2">{education.institution}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {education.duration}
                      </div>
                    </div>
                    
                    {education.achievements.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-300 mb-2">Achievements:</p>
                        <div className="flex flex-wrap gap-2">
                          {education.achievements.map((achievement, achievementIndex) => (
                            <span
                              key={achievementIndex}
                              className="px-2 py-1 bg-yellow-500/30 text-yellow-300 text-xs rounded-full flex items-center gap-1 border border-yellow-400/30"
                            >
                              <Award className="w-3 h-3" />
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditEducation(education)}
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/20"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(education.educationId)}
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

      {/* Add/Edit Education Modal */}
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
                {editingEducation ? 'Edit Education' : 'Add New Education'}
              </h2>

              <form onSubmit={editingEducation ? handleUpdateEducation : handleAddEducation} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Institution</label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Degree/Certificate</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2018 - 2022, 2020, Jan 2019 - Dec 2019"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Achievements (comma separated)</label>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    rows="3"
                    placeholder="Dean's List, Summa Cum Laude, President of CS Club"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all shadow-lg shadow-pink-500/30"
                  >
                    {editingEducation ? 'Update Education' : 'Add Education'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingEducation(null);
                      setFormData({ institution: '', degree: '', duration: '', achievements: '' });
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
            onClick={() => setDeleteConfirm({ show: false, educationId: null, educationTitle: '' })}
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
                  <h3 className="text-xl font-bold text-white">Delete Education</h3>
                  <p className="text-gray-300 text-sm">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-semibold text-white">"{deleteConfirm.educationTitle}"</span>? This will permanently remove the education entry from your portfolio.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm({ show: false, educationId: null, educationTitle: '' })}
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

export default EducationManagement;
