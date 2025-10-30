import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiBookOpen, 
  FiUsers, 
  FiAward, 
  FiPlay, 
  FiMessageSquare,
  FiCheckCircle,
  FiStar
} from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <FiBookOpen className="h-8 w-8 text-primary-600" />,
      title: "Comprehensive Courses",
      description: "Access a wide range of courses across different subjects and skill levels."
    },
    {
      icon: <FiPlay className="h-8 w-8 text-primary-600" />,
      title: "Video Lectures",
      description: "Watch high-quality video lectures with interactive content and resources."
    },
    {
      icon: <FiAward className="h-8 w-8 text-primary-600" />,
      title: "Assignments & Projects",
      description: "Complete assignments and projects to reinforce your learning."
    },
    {
      icon: <FiMessageSquare className="h-8 w-8 text-primary-600" />,
      title: "Real-time Chat",
      description: "Connect with instructors and fellow students through live chat."
    },
    {
      icon: <FiUsers className="h-8 w-8 text-primary-600" />,
      title: "Expert Instructors",
      description: "Learn from experienced instructors and industry professionals."
    },
    {
      icon: <FiCheckCircle className="h-8 w-8 text-primary-600" />,
      title: "Progress Tracking",
      description: "Track your learning progress and achievements."
    }
  ];

  const stats = [
    { number: "1000+", label: "Students" },
    { number: "50+", label: "Courses" },
    { number: "25+", label: "Instructors" },
    { number: "98%", label: "Satisfaction" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Join thousands of students learning with EduNexus - Your gateway to knowledge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/courses"
                    className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600"
                  >
                    Browse Courses
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EduNexus?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join our community of learners and start your educational journey today
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
              >
                Create Account
              </Link>
              <Link
                to="/courses"
                className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600"
              >
                Explore Courses
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Student",
                content: "EduNexus has transformed my learning experience. The video lectures are excellent and the assignments help reinforce concepts.",
                rating: 5
              },
              {
                name: "Mike Chen",
                role: "Student",
                content: "The real-time chat feature allows me to connect with instructors and get help when I need it. Highly recommended!",
                rating: 5
              },
              {
                name: "Emily Davis",
                role: "Student",
                content: "The course structure is well-organized and the progress tracking helps me stay motivated. Great platform!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
