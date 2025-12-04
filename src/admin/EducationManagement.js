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
    achievements: '',
    order: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, educationId: null, educationTitle: '' });

  // Fetch educations from API
  useEffect(() => {
    const fetchEducations = async () => {
      try {
        setLoading(true);
        const response = await educationAPI.getAll();
        // Sort by order if available
        const sortedEducations = response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setEducations(sortedEducations);
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
        achievements: formData.achievements.split(',').map(a => a.trim()).filter(a => a),
        order: parseInt(formData.order) || 0
      };
      const response = await educationAPI.create(educationData);
      const newEducations = [...educations, response.data.education].sort((a, b) => (a.order || 0) - (b.order || 0));
      setEducations(newEducations);
      setMessage({ type: 'success', text: 'Education added successfully!' });
      setShowAddModal(false);
      setFormData({ institution: '', degree: '', duration: '', achievements: '', order: '' });
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
      achievements: education.achievements.join(', '),
      order: education.order || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteEducation = (education) => {
    setDeleteConfirm({
      show: true,
      educationId: education.educationId,
      educationTitle: education.institution
    });
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await educationAPI.delete(deleteConfirm.educationId);
      setEducations(educations.filter(edu => edu.educationId !== deleteConfirm.educationId));
      setMessage({ type: 'success', text: 'Education deleted successfully' });
      setDeleteConfirm({ show: false, educationId: null, educationTitle: '' });
    } catch (error) {
      console.error('Error deleting education:', error);
      setMessage({ type: 'error', text: 'Failed to delete education' });
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
        achievements: formData.achievements.split(',').map(a => a.trim()).filter(a => a),
        order: parseInt(formData.order) || 0
      };
      const response = await educationAPI.update(editingEducation.educationId, educationData);
      const updatedEducations = educations.map(edu =>
        edu.educationId === editingEducation.educationId ? response.data.education : edu
      ).sort((a, b) => (a.order || 0) - (b.order || 0));

      setEducations(updatedEducations);
      setMessage({ type: 'success', text: 'Education updated successfully!' });
      setShowAddModal(false);
      setEditingEducation(null);
      setFormData({ institution: '', degree: '', duration: '', achievements: '', order: '' });
    } catch (error) {
      console.error('Error updating education:', error);
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to update education' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && educations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search education..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all shadow-lg shadow-pink-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Education
        </button>
      </div>

      {/* Message Alert */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredEducations.map((education) => (
            <motion.div
              key={education.educationId}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-pink-500/10 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{education.institution}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {education.degree}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {education.duration}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {education.achievements.map((achievement, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10"
                          >
                            <Award className="w-3 h-3 text-yellow-500" />
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditEducation(education)}
                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(education)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowAddModal(false);
              setEditingEducation(null);
              setFormData({ institution: '', degree: '', duration: '', achievements: '' });
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingEducation ? 'Edit Education' : 'Add New Education'}
              </h2>

              <form onSubmit={editingEducation ? handleUpdateEducation : handleAddEducation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium text-gray-300 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      placeholder="e.g. 1"
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  </div>
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
