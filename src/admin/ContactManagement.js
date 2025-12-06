import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Calendar, User, MessageSquare, AlertCircle, Loader, CheckCircle, Circle, ChevronLeft, ChevronRight, MailOpen } from 'lucide-react';
import { contactAPI } from '../services/api';

const ContactManagement = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalMessages: 0
    });

    useEffect(() => {
        fetchMessages(1);
    }, []);

    const fetchMessages = async (page = 1) => {
        try {
            setLoading(true);
            const response = await contactAPI.getAll(page);
            setMessages(response.data.contacts);
            setPagination({
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
                totalMessages: response.data.totalMessages
            });
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await contactAPI.delete(id);
            setMessages(messages.filter(msg => msg._id !== id));
            // Refresh if page becomes empty
            if (messages.length === 1 && pagination.currentPage > 1) {
                fetchMessages(pagination.currentPage - 1);
            } else {
                fetchMessages(pagination.currentPage);
            }
        } catch (err) {
            console.error('Error deleting message:', err);
            alert('Failed to delete message');
        }
    };

    const toggleReadStatus = async (id) => {
        try {
            const response = await contactAPI.markAsRead(id);
            setMessages(messages.map(msg =>
                msg._id === id ? { ...msg, isRead: response.data.isRead } : msg
            ));
        } catch (err) {
            console.error('Error updating read status:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchMessages(newPage);
        }
    };

    if (loading && messages.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Messages</h2>
                    <p className="text-gray-400">View and manage contact form submissions</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">{pagination.totalMessages} Messages</span>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="grid gap-6">
                <AnimatePresence mode="wait">
                    {messages.map((message) => (
                        <motion.div
                            key={message._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`border rounded-2xl p-6 transition-all duration-300 group ${message.isRead
                                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                    : 'bg-blue-500/5 border-blue-500/30 hover:bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            <User className="w-4 h-4 text-blue-400" />
                                            <span>{message.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Mail className="w-4 h-4 text-purple-400" />
                                            <a href={`mailto:${message.email}`} className="hover:text-purple-400 transition-colors">
                                                {message.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Calendar className="w-4 h-4 text-green-400" />
                                            <span>{formatDate(message.createdAt)}</span>
                                        </div>
                                        {!message.isRead && (
                                            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">
                                                NEW
                                            </span>
                                        )}
                                    </div>

                                    <div className={`rounded-xl p-4 leading-relaxed ${message.isRead ? 'bg-black/30 text-gray-400 font-light' : 'bg-black/40 text-gray-200 font-normal'
                                        }`}>
                                        {message.message}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => toggleReadStatus(message._id)}
                                        className={`p-3 rounded-xl transition-all flex items-center gap-2 ${message.isRead
                                                ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                            }`}
                                        title={message.isRead ? "Mark as Unread" : "Mark as Read"}
                                    >
                                        {message.isRead ? <MailOpen className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(message._id)}
                                        className="p-3 rounded-xl bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 hover:scale-105"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {messages.length === 0 && !loading && (
                    <div className="text-center py-20 text-gray-500">
                        <Mail className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No messages found</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="p-2 rounded-lg bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="text-gray-400 text-sm">
                            Page <span className="text-white font-bold">{pagination.currentPage}</span> of {pagination.totalPages}
                        </div>

                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="p-2 rounded-lg bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactManagement;
