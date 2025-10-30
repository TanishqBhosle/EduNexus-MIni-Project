import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const { isAuthenticated, user } = useAuth();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Guard against double-invocation in React 18 StrictMode (dev only)
      if (initializedRef.current && socket) return;

      const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          userId: user.id,
          userName: user.name
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 10,
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      newSocket.on('receive-message', (data) => {
        setMessages(prev => ({
          ...prev,
          [data.courseId]: [
            ...(prev[data.courseId] || []),
            {
              ...data,
              id: Date.now() + Math.random()
            }
          ]
        }));
      });

      setSocket(newSocket);
      initializedRef.current = true;

      return () => {
        if (newSocket && newSocket.connected) {
          newSocket.disconnect();
        } else if (newSocket) {
          newSocket.close();
        }
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      initializedRef.current = false;
    }
  }, [isAuthenticated, user]);

  const joinCourse = (courseId) => {
    if (socket) {
      socket.emit('join-course', courseId);
    }
  };

  const leaveCourse = (courseId) => {
    if (socket) {
      socket.emit('leave-course', courseId);
    }
  };

  const sendMessage = (courseId, content, type = 'text', attachments = []) => {
    if (socket && user) {
      const messageData = {
        courseId,
        content,
        type,
        attachments,
        sender: {
          id: user.id,
          name: user.name,
          role: user.role
        },
        timestamp: new Date().toISOString()
      };

      try {
        socket.emit('send-message', messageData);
        
        // Add message to local state immediately for optimistic UI
        setMessages(prev => ({
          ...prev,
          [courseId]: [
            ...(prev[courseId] || []),
            {
              ...messageData,
              id: Date.now() + Math.random()
            }
          ]
        }));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const getMessages = (courseId) => {
    return messages[courseId] || [];
  };

  const clearMessages = (courseId) => {
    setMessages(prev => ({
      ...prev,
      [courseId]: []
    }));
  };

  const value = {
    socket,
    joinCourse,
    leaveCourse,
    sendMessage,
    getMessages,
    clearMessages
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
