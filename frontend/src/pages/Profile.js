import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-outline flex items-center"
              >
                <FiEdit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="btn btn-outline flex items-center"
                >
                  <FiX className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary flex items-center"
                >
                  <FiSave className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="text-center">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="h-16 w-16 text-primary-600" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
            </div>

            {/* Profile Information */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900">{user?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900">{user?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <p className="text-gray-900 capitalize">{user?.role}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://example.com/avatar.jpg"
                  />
                ) : (
                  <p className="text-gray-900">{user?.avatar || 'No avatar set'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Course Statistics */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {user?.enrolledCourses?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Enrolled Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {user?.createdCourses?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Created Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">0</div>
                <div className="text-sm text-gray-600">Completed Assignments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
