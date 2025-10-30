const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private (Admin or self)
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses', 'title thumbnail')
      .populate('createdCourses', 'title thumbnail');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is admin or viewing their own profile
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to view this profile' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or self)
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['admin', 'instructor', 'student']).withMessage('Invalid role')
], handleValidationErrors, async (req, res) => {
  try {

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is admin or updating their own profile
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    // Only admin can change roles
    if (req.body.role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change user role' });
    }

    // Check if email is already taken by another user
    if (req.body.email) {
      const existingUser = await User.findOne({ 
        email: req.body.email, 
        _id: { $ne: req.params.id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Toggle user active status
// @access  Private (Admin)
router.put('/:id/status', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow admin to delete themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Remove user from all courses
    await Course.updateMany(
      { students: user._id },
      { $pull: { students: user._id } }
    );

    await Course.updateMany(
      { instructor: user._id },
      { $set: { instructor: null } }
    );

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get platform statistics
// @access  Private (Admin)
router.get('/stats/overview', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Course.aggregate([
      { $project: { studentCount: { $size: '$students' } } },
      { $group: { _id: null, total: { $sum: '$studentCount' } } }
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      publishedCourses,
      totalEnrollments: totalEnrollments[0]?.total || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

module.exports = router;
