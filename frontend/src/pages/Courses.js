import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FiSearch, 
  FiFilter, 
  FiBookOpen, 
  FiUsers, 
  FiClock,
  FiStar,
  FiPlay,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Courses = () => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Web Development', 'Data Science', 'Design', 'Business', 'Marketing', 'Other'];
  const levels = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedCategory, selectedLevel, currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedLevel) params.append('level', selectedLevel);

      const response = await axios.get(`/api/courses?${params}`);
      setCourses(response.data.courses || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching courses:', error);
      const message = error.response?.data?.message || 'Failed to fetch courses';
      toast.error(message);
      setCourses([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in courses');
      return;
    }

    try {
      await axios.post(`/api/courses/${courseId}/enroll`);
      toast.success('Successfully enrolled in course!');
      fetchCourses(); // Refresh courses
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to enroll in course';
      toast.error(message);
      
      // If enrollment failed due to already enrolled, refresh the page
      if (message.includes('already enrolled')) {
        fetchCourses();
      }
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await axios.delete(`/api/courses/${courseId}`);
      toast.success('Course deleted successfully');
      fetchCourses(); // Refresh courses
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete course';
      toast.error(message);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setCurrentPage(1);
  };

  const isEnrolled = (course) => {
    return course.students?.some(student => student._id === user?.id);
  };

  const isInstructor = (course) => {
    return course.instructor?._id === user?.id;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
          <p className="text-gray-600">Discover and enroll in courses that match your interests</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="input"
                  >
                    <option value="">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="btn btn-outline mr-2"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {courses.map((course) => (
                <div key={course._id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Course Thumbnail */}
                  <div className="aspect-w-16 aspect-h-9">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <FiBookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                        {course.category}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <FiUsers className="h-4 w-4 mr-1" />
                        {course.studentCount || 0}
                      </div>
                      <div className="flex items-center">
                        <FiPlay className="h-4 w-4 mr-1" />
                        {course.lectureCount || 0}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="h-4 w-4 mr-1" />
                        {course.duration || 0}h
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        ${course.price || 0}
                      </div>

                      <div className="flex space-x-2">
                        {isInstructor(course) ? (
                          <>
                            <Link
                              to={`/edit-course/${course._id}`}
                              className="btn btn-sm btn-outline"
                            >
                              <FiEdit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="btn btn-sm btn-outline text-red-600 hover:bg-red-50"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : isEnrolled(course) ? (
                          <Link
                            to={`/courses/${course._id}`}
                            className="btn btn-sm btn-primary"
                          >
                            View Course
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course._id)}
                            className="btn btn-sm btn-primary"
                            disabled={!isAuthenticated}
                          >
                            Enroll
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn btn-outline btn-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`btn btn-sm ${
                        currentPage === index + 1 ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline btn-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FiBookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
