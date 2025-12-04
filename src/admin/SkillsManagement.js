import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Code,
    CheckCircle,
    AlertCircle,
    Cpu
} from 'lucide-react';
import { skillsAPI } from '../services/api';

const SkillsManagement = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        category: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, skillId: null, skillName: '' });

    // Fetch skills from API
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const response = await skillsAPI.getAll();
                setSkills(response.data || []);
            } catch (error) {
                console.error('Error fetching skills:', error);
                setMessage({ type: 'error', text: 'Failed to load skills' });
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddSkill = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const skillData = {
                ...formData,
                level: parseInt(formData.level)
            };
            const response = await skillsAPI.create(skillData);
            // Assuming response.data is the created skill or contains it
            const newSkill = response.data.skill || response.data;
            setSkills([...skills, newSkill]);
            setMessage({ type: 'success', text: 'Skill added successfully!' });
            setShowAddModal(false);
            setFormData({ name: '', level: '', category: '' });
        } catch (error) {
            console.error('Error adding skill:', error);
            setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to add skill' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditSkill = (skill) => {
        setEditingSkill(skill);
        setFormData({
            name: skill.name,
            level: skill.level,
            category: skill.category
        });
        setShowAddModal(true);
    };

    const handleDeleteSkill = (skillId) => {
        const skill = skills.find(s => s._id === skillId || s.id === skillId);
        setDeleteConfirm({ show: true, skillId, skillName: skill?.name || 'this skill' });
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            await skillsAPI.delete(deleteConfirm.skillId);
            setSkills(skills.filter(s => (s._id || s.id) !== deleteConfirm.skillId));
            setMessage({ type: 'success', text: 'Skill deleted successfully!' });
            setDeleteConfirm({ show: false, skillId: null, skillName: '' });
        } catch (error) {
            console.error('Error deleting skill:', error);
            setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to delete skill' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSkill = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const skillData = {
                ...formData,
                level: parseInt(formData.level)
            };
            const skillId = editingSkill._id || editingSkill.id;
            const response = await skillsAPI.update(skillId, skillData);
            const updatedSkill = response.data.skill || response.data;

            setSkills(skills.map(s =>
                (s._id || s.id) === skillId ? updatedSkill : s
            ));
            setMessage({ type: 'success', text: 'Skill updated successfully!' });
            setShowAddModal(false);
            setEditingSkill(null);
            setFormData({ name: '', level: '', category: '' });
        } catch (error) {
            console.error('Error updating skill:', error);
            setMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to update skill' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !showAddModal && !deleteConfirm.show) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white drop-shadow">Skills Management</h1>
                    <p className="text-gray-300">Manage your technical skills and expertise</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:scale-105 transition-all shadow-lg shadow-blue-500/30"
                >
                    <Plus className="w-4 h-4" />
                    Add Skill
                </button>
            </div>

            {/* Message Display */}
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg flex items-center gap-3 backdrop-blur-sm ${message.type === 'success'
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
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                    {filteredSkills.map((skill, index) => (
                        <motion.div
                            key={skill._id || skill.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <Code className="w-5 h-5 text-white" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                                        <p className="text-blue-400 text-sm font-medium">{skill.category}</p>

                                        <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                                            <div
                                                className="bg-blue-500 h-1.5 rounded-full"
                                                style={{ width: `${skill.level}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1 text-right">{skill.level}%</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                    <button
                                        onClick={() => handleEditSkill(skill)}
                                        className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/20"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSkill(skill._id || skill.id)}
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

            {/* Add/Edit Skill Modal */}
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
                            className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold text-white mb-6 drop-shadow">
                                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                            </h2>

                            <form onSubmit={editingSkill ? handleUpdateSkill : handleAddSkill} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Skill Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g. React, Python"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    >
                                        <option value="" className="bg-gray-900 text-gray-400">Select Category</option>
                                        <option value="Frontend" className="bg-gray-900">Frontend</option>
                                        <option value="Backend" className="bg-gray-900">Backend</option>
                                        <option value="Database" className="bg-gray-900">Database</option>
                                        <option value="DevOps" className="bg-gray-900">DevOps</option>
                                        <option value="Tools" className="bg-gray-900">Tools</option>
                                        <option value="Other" className="bg-gray-900">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Proficiency Level (0-100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all shadow-lg shadow-blue-500/30"
                                    >
                                        {editingSkill ? 'Update Skill' : 'Add Skill'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingSkill(null);
                                            setFormData({ name: '', level: '', category: '' });
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
                        onClick={() => setDeleteConfirm({ show: false, skillId: null, skillName: '' })}
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
                                    <h3 className="text-xl font-bold text-white">Delete Skill</h3>
                                    <p className="text-gray-300 text-sm">This action cannot be undone</p>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete <span className="font-semibold text-white">"{deleteConfirm.skillName}"</span>?
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all shadow-lg shadow-red-500/30"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, skillId: null, skillName: '' })}
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

export default SkillsManagement;
