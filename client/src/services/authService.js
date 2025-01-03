import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// Get user from token (using the protected /api/home route)
export const getUserFromToken = async (token) => {
  try {
    const response = await axios.get('http://localhost:8000/api/home', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Assuming the response contains a welcome message with the user's name
    const message = response.data.message; // e.g., "Welcome, John!"
    const name = message.split(',')[1].split('!')[0].trim();
    return { name };
  } catch (error) {
    console.error('Error fetching user from token:', error);
    return null;
  }
};

// Example of making an authenticated request
export const fetchHomeData = async (token) => {
  const response = await axios.get('http://localhost:8000/api/home', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};