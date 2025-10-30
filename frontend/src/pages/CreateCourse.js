import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    duration: 0,
    requirements: [''],
    whatYouWillLearn: [''],
    tags: ['']
  });

  const categories = ['Web Development', 'Data Science', 'Design', 'Business', 'Marketing', 'Other'];
  const levels = ['beginner', 'intermediate', 'advanced'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Clean up empty array items
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(item => item.trim() !== ''),
        whatYouWillLearn: formData.whatYouWillLearn.filter(item => item.trim() !== ''),
        tags: formData.tags.filter(item => item.trim() !== '')
      };

      const response = await axios.post('/api/courses', cleanedData);
      toast.success('Course created successfully!');
      navigate(`/edit-course/${response.data.course._id}`);
    } catch (error) {
      let message = 'Failed to create course';
      let errors = null;
      
      if (error.response?.data) {
        message = error.response.data.message || message;
        errors = error.response.data.errors || null;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      
      toast.error(message);
      
      // Handle validation errors
      if (errors) {
        console.error('Validation errors:', errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-2">Fill in the details to create your course</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input"
                  placeholder="Describe what students will learn in this course"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="input"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* What Students Will Learn */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What Students Will Learn</h2>
            <div className="space-y-3">
              {formData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('whatYouWillLearn', index, e.target.value)}
                    className="input flex-1"
                    placeholder="What will students learn?"
                  />
                  {formData.whatYouWillLearn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('whatYouWillLearn', index)}
                      className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('whatYouWillLearn')}
                className="btn btn-outline btn-sm"
              >
                <FiPlus className="h-4 w-4 mr-1" />
                Add Learning Outcome
              </button>
            </div>
          </div>

          {/* Requirements */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Requirements</h2>
            <div className="space-y-3">
              {formData.requirements.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="input flex-1"
                    placeholder="What do students need to know before taking this course?"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="btn btn-outline btn-sm"
              >
                <FiPlus className="h-4 w-4 mr-1" />
                Add Requirement
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tags</h2>
            <div className="space-y-3">
              {formData.tags.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                    className="input flex-1"
                    placeholder="Add a tag"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('tags')}
                className="btn btn-outline btn-sm"
              >
                <FiPlus className="h-4 w-4 mr-1" />
                Add Tag
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
