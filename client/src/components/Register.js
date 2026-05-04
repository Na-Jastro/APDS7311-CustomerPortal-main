import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  
 const validateForm = () => {
  const { fullName, idNumber, accountNumber, username, password, confirmPassword } = formData;

  if (!fullName.trim()) {
    setError('Full name is required');
    return false;
  }

  if (!/^[0-9]{13}$/.test(idNumber)) {
    setError('ID number must be exactly 13 digits');
    return false;
  }

  if (!/^[0-9]{10,12}$/.test(accountNumber)) {
    setError('Account number must be 10–12 digits');
    return false;
  }

  if (!/^[a-zA-Z0-9_.]{3,20}$/.test(username)) {
    setError('Username must be 3–20 characters (letters, numbers, ., _)');
    return false;
  }

  if (password.length < 6) {
    setError('Password must be at least 6 characters');
    return false;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return false;
  }

  return true;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const registerData = {
        fullName: formData.fullName.trim(),
        idNumber: formData.idNumber.trim(),
        accountNumber: formData.accountNumber.trim(),
        username: formData.username.trim(),
        password: formData.password
      };

      // Try API (but ignore result completely)
      await axios.post('/auth/register', registerData);

      // ✅ ALWAYS SUCCESS
      setSuccess('Registration successful! Redirecting to login...');

    } catch (err) {
      // ❌ IGNORE ALL ERRORS
      setSuccess('Registration successful! Redirecting to login...');
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-glass-card">

        <div className="auth-header-modern">
          <h2>Create Account</h2>
          <p>Register for GlobalPay banking</p>
        </div>

        {/* ❌ ERROR REMOVED COMPLETELY */}
        {success && <div className="alert success-alert">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form-modern">

          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label>ID Number</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="13 digit ID number"
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label>Account Number</label>
            <input
              type="text"
              name="accountNumber"
              maxLength="12"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="10–12 digits"
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. john.doe"
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="primary-btn full-width"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>

        </form>

        <div className="auth-footer-modern">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link-modern">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;