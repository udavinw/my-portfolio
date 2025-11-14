import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Briefcase, 
  GraduationCap, 
  MessageSquare,
  TrendingUp,
  Eye,
  Plus,
  BarChart3,
  Activity,
  Star
} from 'lucide-react';
import { projectsAPI, experienceAPI, educationAPI, testimonialsAPI } from '../services/api';

const DashboardStats = ({ stats = {}, loading = false }) => {
  const { projects = 0, experiences = 0, education = 0, testimonials = 0 } = stats;

  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState({
    totalViews: 0,
    rating: 0,
    growthRate: 0
  });

  // Fetch recent activity from all APIs
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setActivityLoading(true);
        const [projectsRes, experiencesRes, educationRes, testimonialsRes] = await Promise.all([
          projectsAPI.getAll(),
          experienceAPI.getAll(),
          educationAPI.getAll(),
          testimonialsAPI.getAll()
        ]);

        const activities = [];

        // Process projects (most recent first)
        projectsRes.data
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 2)
          .forEach(project => {
            activities.push({
              id: `project_${project.projectId}`,
              action: 'Project',
              item: project.title,
              time: formatTimeAgo(project.updatedAt),
              type: 'project'
            });
          });

        // Process experiences
        experiencesRes.data
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 1)
          .forEach(experience => {
            activities.push({
              id: `experience_${experience.experienceId}`,
              action: 'Experience',
              item: `${experience.role} at ${experience.company}`,
              time: formatTimeAgo(experience.updatedAt),
              type: 'experience'
            });
          });

        // Process education
        educationRes.data
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 1)
          .forEach(edu => {
            activities.push({
              id: `education_${edu.educationId}`,
              action: 'Education',
              item: `${edu.degree} from ${edu.institution}`,
              time: formatTimeAgo(edu.updatedAt),
              type: 'education'
            });
          });

        // Process testimonials
        testimonialsRes.data
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 1)
          .forEach(testimonial => {
            activities.push({
              id: `testimonial_${testimonial.testimonialId}`,
              action: 'Testimonial',
              item: `From ${testimonial.name}`,
              time: formatTimeAgo(testimonial.updatedAt),
              type: 'testimonial'
            });
          });

        // Sort all activities by time and take the most recent 4
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivity(activities.slice(0, 4));

        // Calculate performance metrics
        const totalItems = projectsRes.data.length + experiencesRes.data.length + educationRes.data.length + testimonialsRes.data.length;
        setPerformanceData({
          totalViews: Math.floor(totalItems * 150 + Math.random() * 500), // Simulated views based on content
          rating: 4.8,
          growthRate: Math.floor(Math.random() * 20 + 10) // Random growth rate between 10-30%
        });

      } catch (error) {
        console.error('Error fetching recent activity:', error);
        // Fallback to empty activity
        setRecentActivity([]);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  const statCards = [
    {
      title: 'Projects',
      value: projects,
      icon: FolderOpen,
      color: 'from-blue-500 to-blue-600',
      change: '+2 this month',
      changeColor: 'text-green-600'
    },
    {
      title: 'Experience',
      value: experiences,
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      change: 'Recently updated',
      changeColor: 'text-slate-600'
    },
    {
      title: 'Education',
      value: education,
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      change: 'Complete',
      changeColor: 'text-slate-600'
    },
    {
      title: 'Testimonials',
      value: testimonials,
      icon: MessageSquare,
      color: 'from-pink-500 to-pink-600',
      change: '+1 this week',
      changeColor: 'text-green-600'
    }
  ];

  const quickActions = [
    { label: 'Add Project', icon: Plus, color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Add Experience', icon: Briefcase, color: 'bg-green-500 hover:bg-green-600' },
    { label: 'Add Education', icon: GraduationCap, color: 'bg-purple-500 hover:bg-purple-600' },
    { label: 'Add Testimonial', icon: MessageSquare, color: 'bg-pink-500 hover:bg-pink-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2 drop-shadow">Welcome back, Admin! ✦</h1>
          <p className="text-gray-300 mb-6">Here's what's happening with your portfolio today.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-12 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 w-16 bg-white/20 rounded"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-300">{stat.title}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${
                stat.changeColor === 'text-green-600' ? 'text-green-400' : 'text-gray-300'
              }`}>{stat.change}</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <button className="text-sm text-pink-400 hover:text-pink-300 font-medium transition-colors">View all</button>
          </div>
          <div className="space-y-4">
            {activityLoading ? (
              // Loading skeleton for recent activity
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-white/20 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                    <div className="h-3 bg-white/20 rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="h-3 w-16 bg-white/20 rounded animate-pulse"></div>
                </div>
              ))
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm ${
                    activity.type === 'project' ? 'bg-blue-500/30 border border-blue-400/30' :
                    activity.type === 'experience' ? 'bg-green-500/30 border border-green-400/30' :
                    activity.type === 'education' ? 'bg-purple-500/30 border border-purple-400/30' :
                    'bg-pink-500/30 border border-pink-400/30'
                  }`}>
                    {activity.type === 'project' && <FolderOpen className="w-5 h-5 text-blue-300" />}
                    {activity.type === 'experience' && <Briefcase className="w-5 h-5 text-green-300" />}
                    {activity.type === 'education' && <GraduationCap className="w-5 h-5 text-purple-300" />}
                    {activity.type === 'testimonial' && <MessageSquare className="w-5 h-5 text-pink-300" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{activity.action}</p>
                    <p className="text-xs text-gray-300">{activity.item}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-white ${action.color} transition-all duration-200 hover:scale-105 shadow-lg`}
              >
                <action.icon className="w-4 h-4" />
                <span className="font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;
