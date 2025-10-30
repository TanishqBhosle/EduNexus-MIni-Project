import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import LecturePlayer from './pages/LecturePlayer';
import Assignments from './pages/Assignments';
import AssignmentDetail from './pages/AssignmentDetail';
import CreateAssignment from './pages/CreateAssignment';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                
                <Route path="/create-course" element={
                  <ProtectedRoute allowedRoles={['instructor']}>
                    <CreateCourse />
                  </ProtectedRoute>
                } />
                
                <Route path="/edit-course/:id" element={
                  <ProtectedRoute allowedRoles={['instructor']}>
                    <EditCourse />
                  </ProtectedRoute>
                } />
                
                <Route path="/lecture/:courseId/:lectureId" element={
                  <ProtectedRoute>
                    <LecturePlayer />
                  </ProtectedRoute>
                } />
                
                <Route path="/assignments/:courseId" element={
                  <ProtectedRoute>
                    <Assignments />
                  </ProtectedRoute>
                } />
                
                <Route path="/assignment/:id" element={
                  <ProtectedRoute>
                    <AssignmentDetail />
                  </ProtectedRoute>
                } />
                
                <Route path="/create-assignment/:courseId" element={
                  <ProtectedRoute allowedRoles={['instructor']}>
                    <CreateAssignment />
                  </ProtectedRoute>
                } />
                
                <Route path="/chat/:courseId" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
