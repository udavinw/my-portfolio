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

  const handleDeleteEducation = async (educationId) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        setLoading(true);
        await educationAPI.delete(educationId);
        setEducations(educations.filter(edu => edu.educationId !== educationId));
        setMessage({ type: 'success', text: 'Education deleted successfully!' });
      } catch (error) {
        console.error('Error deleting education:', error);
        setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to delete education' });
      } finally {
        setLoading(false);
      }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Education Management</h1>
          <p className="text-slate-600">Manage your educational background</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search education..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-800">{education.degree}</h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Completed
                      </span>
                    </div>
                    <p className="text-purple-600 font-medium mb-2">{education.institution}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {education.duration}
                      </div>
                    </div>
                    
                    {education.achievements.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-slate-700 mb-2">Achievements:</p>
                        <div className="flex flex-wrap gap-2">
                          {education.achievements.map((achievement, achievementIndex) => (
                            <span
                              key={achievementIndex}
                              className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"
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
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(education.educationId)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                {editingEducation ? 'Edit Education' : 'Add New Education'}
              </h2>

              <form onSubmit={editingEducation ? handleUpdateEducation : handleAddEducation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Degree/Certificate</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2018 - 2022, 2020, Jan 2019 - Dec 2019"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Achievements (comma separated)</label>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
                    rows="3"
                    placeholder="Dean's List, Summa Cum Laude, President of CS Club"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
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
                    className="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EducationManagement;
