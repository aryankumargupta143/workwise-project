import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/register.css';
import { AuthContext } from '../../contexts/AuthContext';
import { registerUser } from '../../services/authService';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, email, password, confirmPassword } = values;
  
    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
  
    try {
      const data = await registerUser({ name, email, password, confirmPassword });
      if (data.success) {
        login(data.token, data.user);
        toast.success('Registered successfully');
        setTimeout(() => navigate('/'), 1000); // Add a delay before redirecting
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };
  

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                autoComplete="off"
                name="name"
                className="input-field"
                value={values.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                autoComplete="off"
                name="email"
                className="input-field"
                value={values.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                className="input-field"
                value={values.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                className="input-field"
                value={values.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Register
            </button>
          </form>
          <p>
            Already Have an Account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;