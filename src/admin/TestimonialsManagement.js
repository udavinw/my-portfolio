import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MessageSquare,
  User,
  Building2,
  Star,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { testimonialsAPI } from '../services/api';

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    feedback: '',
    avatar: null,
    order: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, testimonialId: null, testimonialTitle: '' });

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await testimonialsAPI.getAll();
        // Sort by order if available
        const sortedTestimonials = response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setTestimonials(sortedTestimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setMessage({ type: 'error', text: 'Failed to load testimonials' });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.feedback.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('feedback', formData.feedback);
      formDataToSend.append('order', formData.order || 0);
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      const response = await testimonialsAPI.create(formDataToSend);
      const newTestimonials = [...testimonials, response.data.testimonial].sort((a, b) => (a.order || 0) - (b.order || 0));
      setTestimonials(newTestimonials);
      setMessage({ type: 'success', text: 'Testimonial added successfully!' });
      setShowAddModal(false);
      setFormData({ name: '', company: '', role: '', feedback: '', avatar: null, order: '' });
    } catch (error) {
      console.error('Error adding testimonial:', error);
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to add testimonial' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      role: testimonial.role,
      feedback: testimonial.feedback,
      avatar: null,
      order: testimonial.order || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteTestimonial = (testimonial) => {
    setDeleteConfirm({
      show: true,
      testimonialId: testimonial.testimonialId,
      testimonialTitle: testimonial.name
    });
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await testimonialsAPI.delete(deleteConfirm.testimonialId);
      setTestimonials(testimonials.filter(test => test.testimonialId !== deleteConfirm.testimonialId));
      setMessage({ type: 'success', text: 'Testimonial deleted successfully' });
      setDeleteConfirm({ show: false, testimonialId: null, testimonialTitle: '' });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      setMessage({ type: 'error', text: 'Failed to delete testimonial' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTestimonial = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('feedback', formData.feedback);
      formDataToSend.append('order', formData.order || 0);
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      const response = await testimonialsAPI.update(editingTestimonial.testimonialId, formDataToSend);
      const updatedTestimonials = testimonials.map(test =>
        test.testimonialId === editingTestimonial.testimonialId ? response.data.testimonial : test
      ).sort((a, b) => (a.order || 0) - (b.order || 0));

      setTestimonials(updatedTestimonials);
      setMessage({ type: 'success', text: 'Testimonial updated successfully!' });
      setShowAddModal(false);
      setEditingTestimonial(null);
      setFormData({ name: '', company: '', role: '', feedback: '', avatar: null, order: '' });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to update testimonial' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && testimonials.length === 0) {
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
            placeholder="Search testimonials..."
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
          Add Testimonial
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

      {/* Testimonials List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.testimonialId}
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
                      <MessageSquare className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{testimonial.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {testimonial.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {testimonial.role}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm italic">"{testimonial.feedback}"</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditTestimonial(testimonial)}
                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial)}
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
              setEditingTestimonial(null);
              setFormData({ name: '', company: '', role: '', feedback: '', avatar: null });
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
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>

              <form onSubmit={editingTestimonial ? handleUpdateTestimonial : handleAddTestimonial} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role/Position</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Feedback</label>
                  <textarea
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    rows="4"
                    placeholder="Enter the testimonial feedback..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Avatar Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.files[0] })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-500/30 file:text-white hover:file:bg-pink-500/40"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all shadow-lg shadow-pink-500/30"
                  >
                    {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingTestimonial(null);
                      setFormData({ name: '', company: '', role: '', feedback: '', avatar: null });
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
            onClick={() => setDeleteConfirm({ show: false, testimonialId: null, testimonialTitle: '' })}
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
                  <h3 className="text-xl font-bold text-white">Delete Testimonial</h3>
                  <p className="text-gray-300 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-semibold text-white">"{deleteConfirm.testimonialTitle}"</span>? This will permanently remove the testimonial from your portfolio.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm({ show: false, testimonialId: null, testimonialTitle: '' })}
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

export default TestimonialsManagement;
