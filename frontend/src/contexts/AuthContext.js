import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptor for token
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const res = await axios.get('/api/auth/profile');
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: res.data.user,
              token: state.token
            }
          });
        } catch (error) {
          console.error('Load user error:', error);
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUser();
  }, [state.token]);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('/api/auth/login', { email, password });
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      let message = 'Login failed';
      let field = null;
      
      if (error.response?.data) {
        message = error.response.data.message || message;
        field = error.response.data.field || null;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      
      toast.error(message);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: message, field };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('/api/auth/register', userData);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      let message = 'Registration failed';
      let field = null;
      let errors = null;
      
      if (error.response?.data) {
        message = error.response.data.message || message;
        field = error.response.data.field || null;
        errors = error.response.data.errors || null;
      } else if (error.request) {
        message = 'Network error. Please check your connection.';
      }
      
      toast.error(message);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: message, field, errors };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      dispatch({
        type: 'UPDATE_USER',
        payload: res.data.user
      });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
