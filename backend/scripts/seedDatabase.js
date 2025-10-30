const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edunexus', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@edunexus.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'John Instructor',
        email: 'instructor@edunexus.com',
        password: 'instructor123',
        role: 'instructor'
      },
      {
        name: 'Jane Student',
        email: 'student@edunexus.com',
        password: 'student123',
        role: 'student'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'instructor'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'student'
      }
    ]);
    console.log('👥 Created users');

    // Create courses
    const courses = await Course.create([
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to become a full-stack developer.',
        instructor: users[1]._id, // John Instructor
        category: 'Web Development',
        level: 'beginner',
        price: 99.99,
        duration: 40,
        isPublished: true,
        whatYouWillLearn: [
          'Build responsive websites with HTML and CSS',
          'Create interactive web applications with JavaScript',
          'Develop full-stack applications with React and Node.js',
          'Work with databases using MongoDB',
          'Deploy applications to the cloud'
        ],
        requirements: [
          'Basic computer skills',
          'No programming experience required',
          'Willingness to learn'
        ],
        tags: ['web development', 'javascript', 'react', 'nodejs', 'mongodb']
      },
      {
        title: 'Data Science with Python',
        description: 'Master data analysis, machine learning, and data visualization using Python.',
        instructor: users[3]._id, // Sarah Wilson
        category: 'Data Science',
        level: 'intermediate',
        price: 149.99,
        duration: 35,
        isPublished: true,
        whatYouWillLearn: [
          'Analyze data using pandas and NumPy',
          'Create visualizations with matplotlib and seaborn',
          'Build machine learning models with scikit-learn',
          'Work with Jupyter notebooks',
          'Handle real-world datasets'
        ],
        requirements: [
          'Basic Python knowledge',
          'High school level mathematics',
          'Computer with Python installed'
        ],
        tags: ['data science', 'python', 'machine learning', 'pandas', 'numpy']
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Learn the principles of user interface and user experience design.',
        instructor: users[1]._id, // John Instructor
        category: 'Design',
        level: 'beginner',
        price: 79.99,
        duration: 25,
        isPublished: true,
        whatYouWillLearn: [
          'Understand design principles and psychology',
          'Create wireframes and prototypes',
          'Design user interfaces with Figma',
          'Conduct user research and testing',
          'Build a design portfolio'
        ],
        requirements: [
          'No design experience required',
          'Access to Figma (free)',
          'Creative mindset'
        ],
        tags: ['ui design', 'ux design', 'figma', 'prototyping', 'user research']
      },
      {
        title: 'Digital Marketing Masterclass',
        description: 'Comprehensive guide to digital marketing strategies and tools.',
        instructor: users[3]._id, // Sarah Wilson
        category: 'Marketing',
        level: 'intermediate',
        price: 129.99,
        duration: 30,
        isPublished: false, // Not published yet
        whatYouWillLearn: [
          'Develop marketing strategies',
          'Run social media campaigns',
          'Use Google Analytics and Ads',
          'Create content marketing plans',
          'Measure marketing ROI'
        ],
        requirements: [
          'Basic business knowledge',
          'Access to social media platforms',
          'Willingness to experiment'
        ],
        tags: ['digital marketing', 'social media', 'google ads', 'analytics', 'content marketing']
      }
    ]);
    console.log('📚 Created courses');

    // Enroll students in courses
    const student1 = users[2]; // Jane Student
    const student2 = users[4]; // Mike Johnson

    // Enroll Jane in first two courses
    await Course.findByIdAndUpdate(courses[0]._id, {
      $push: { students: student1._id }
    });
    await Course.findByIdAndUpdate(courses[1]._id, {
      $push: { students: student1._id }
    });

    // Enroll Mike in first and third courses
    await Course.findByIdAndUpdate(courses[0]._id, {
      $push: { students: student2._id }
    });
    await Course.findByIdAndUpdate(courses[2]._id, {
      $push: { students: student2._id }
    });

    // Update user enrolled courses
    await User.findByIdAndUpdate(student1._id, {
      $push: { 
        enrolledCourses: courses[0]._id,
        enrolledCourses: courses[1]._id
      }
    });

    await User.findByIdAndUpdate(student2._id, {
      $push: { 
        enrolledCourses: courses[0]._id,
        enrolledCourses: courses[2]._id
      }
    });

    console.log('🎓 Enrolled students in courses');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin: admin@edunexus.com / admin123');
    console.log('Instructor: instructor@edunexus.com / instructor123');
    console.log('Student: student@edunexus.com / student123');
    console.log('Instructor 2: sarah@example.com / password123');
    console.log('Student 2: mike@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    process.exit(1);
  } finally {
    try {
      await mongoose.disconnect();
      console.log('👋 Disconnected from MongoDB');
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
