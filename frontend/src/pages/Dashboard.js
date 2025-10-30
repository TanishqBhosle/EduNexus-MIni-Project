import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FiBookOpen, 
  FiUsers, 
  FiAward, 
  FiPlay, 
  FiPlus,
  FiTrendingUp,
  FiClock,
  FiMessageSquare
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledCourses: 0,
    createdCourses: 0,
    totalAssignments: 0,
    completedAssignments: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's courses
      const coursesRes = await axios.get('/api/courses/my-courses');
      const { enrolledCourses = [], createdCourses = [] } = coursesRes.data;

      // Calculate stats
      const totalCourses = user.role === 'instructor' ? createdCourses.length : enrolledCourses.length;
      const enrolledCount = enrolledCourses.length;
      const createdCount = createdCourses.length;

      setStats({
        totalCourses,
        enrolledCourses: enrolledCount,
        createdCourses: createdCount,
        totalAssignments: 0, // Will be calculated from assignments
        completedAssignments: 0
      });

      // Set recent courses
      const recent = user.role === 'instructor' ? createdCourses : enrolledCourses;
      setRecentCourses(recent.slice(0, 4));

      // Fetch recent assignments if student
      if (user.role === 'student') {
        // This would need to be implemented in the backend
        // For now, we'll set empty array
        setRecentAssignments([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const message = error.response?.data?.message || 'Failed to fetch dashboard data';
      toast.error(message);
      
      // Set default values on error
      setStats({
        totalCourses: 0,
        enrolledCourses: 0,
        createdCourses: 0,
        totalAssignments: 0,
        completedAssignments: 0
      });
      setRecentCourses([]);
      setRecentAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome to your {user?.role} dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FiBookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {user?.role === 'instructor' ? 'Created Courses' : 'Enrolled Courses'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {user?.role === 'instructor' ? stats.createdCourses : stats.enrolledCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiAward className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAssignments}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiPlay className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lectures Watched</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiTrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">0%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {user?.role === 'instructor' && (
              <Link
                to="/create-course"
                className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center">
                  <FiPlus className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Create Course</h3>
                    <p className="text-sm text-gray-600">Start a new course</p>
                  </div>
                </div>
              </Link>
            )}

            <Link
              to="/courses"
              className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center">
                <FiBookOpen className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Browse Courses</h3>
                  <p className="text-sm text-gray-600">Explore all courses</p>
                </div>
              </div>
            </Link>

            <Link
              to="/profile"
              className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center">
                <FiUsers className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Profile</h3>
                  <p className="text-sm text-gray-600">Update your profile</p>
                </div>
              </div>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center">
                  <FiUsers className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Admin Panel</h3>
                    <p className="text-sm text-gray-600">Manage platform</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.role === 'instructor' ? 'Your Courses' : 'Recent Courses'}
            </h2>
            <Link
              to="/courses"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              View all →
            </Link>
          </div>

          {recentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentCourses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FiBookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{course.level}</span>
                    <span>{course.studentCount || 0} students</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiBookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {user?.role === 'instructor' ? 'No courses created yet' : 'No courses enrolled yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {user?.role === 'instructor' 
                  ? 'Start by creating your first course'
                  : 'Browse and enroll in courses to get started'
                }
              </p>
              <Link
                to={user?.role === 'instructor' ? '/create-course' : '/courses'}
                className="btn btn-primary"
              >
                {user?.role === 'instructor' ? 'Create Course' : 'Browse Courses'}
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="card p-6">
            <div className="text-center py-8">
              <FiClock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recent activity
              </h3>
              <p className="text-gray-600">
                Your recent activity will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
