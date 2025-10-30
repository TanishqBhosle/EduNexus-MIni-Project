import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FiPlay, 
  FiUsers, 
  FiClock, 
  FiAward, 
  FiMessageSquare,
  FiBookOpen,
  FiCheckCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data);
      
      // Check if user is enrolled
      if (isAuthenticated && user) {
        setEnrolled(response.data.students?.some(student => student._id === user.id) || false);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      const message = error.response?.data?.message || 'Failed to fetch course details';
      toast.error(message);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in courses');
      return;
    }

    try {
      await axios.post(`/api/courses/${id}/enroll`);
      setEnrolled(true);
      toast.success('Successfully enrolled in course!');
      // Refresh course data to get updated student count
      fetchCourse();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to enroll in course';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link to="/courses" className="btn btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                  {course.category}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <p className="text-gray-600 mb-6">
                {course.description}
              </p>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <FiUsers className="h-4 w-4 mr-2" />
                  {course.studentCount} students
                </div>
                <div className="flex items-center">
                  <FiPlay className="h-4 w-4 mr-2" />
                  {course.lectureCount} lectures
                </div>
                <div className="flex items-center">
                  <FiClock className="h-4 w-4 mr-2" />
                  {course.duration} hours
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h2>
              <ul className="space-y-2">
                {course.whatYouWillLearn?.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lectures */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Content</h2>
              {course.lectures && course.lectures.length > 0 ? (
                <div className="space-y-2">
                  {course.lectures.map((lecture, index) => (
                    <div key={lecture._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <FiPlay className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{lecture.title}</span>
                        {lecture.isPreview && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Preview
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.floor(lecture.duration / 60)}:{(lecture.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No lectures available yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Card */}
            <div className="card p-6 mb-6 sticky top-8">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${course.price || 0}
                </div>
                <div className="text-sm text-gray-500">One-time payment</div>
              </div>

              {enrolled ? (
                <div className="space-y-3">
                  <Link
                    to={`/courses/${course._id}/lectures`}
                    className="btn btn-primary w-full"
                  >
                    Continue Learning
                  </Link>
                  <Link
                    to={`/chat/${course._id}`}
                    className="btn btn-outline w-full flex items-center justify-center"
                  >
                    <FiMessageSquare className="h-4 w-4 mr-2" />
                    Course Chat
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="btn btn-primary w-full"
                  disabled={!isAuthenticated}
                >
                  {isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
                </button>
              )}

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">This course includes:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <FiPlay className="h-4 w-4 text-green-500 mr-2" />
                    {course.lectureCount} video lectures
                  </li>
                  <li className="flex items-center">
                    <FiBookOpen className="h-4 w-4 text-green-500 mr-2" />
                    Course materials
                  </li>
                  <li className="flex items-center">
                    <FiAward className="h-4 w-4 text-green-500 mr-2" />
                    Certificate of completion
                  </li>
                  <li className="flex items-center">
                    <FiMessageSquare className="h-4 w-4 text-green-500 mr-2" />
                    Community access
                  </li>
                </ul>
              </div>
            </div>

            {/* Instructor */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">
                    {course.instructor?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{course.instructor?.name}</div>
                  <div className="text-sm text-gray-500">{course.instructor?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
