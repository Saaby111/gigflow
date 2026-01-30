import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  
 
  
  setLoading(true);
  setError('');
  
  try {
    console.log('📡 Calling authAPI.login...');
    const response = await authAPI.login(formData);
    console.log('✅ Login response:', response);
    
    if (response.success) {
      console.log('🎉 Login successful!');
      navigate('/dashboard');
    } else {
      console.log('❌ Login failed in response');
      setError(response.message || 'Login failed');
    }
    
  } catch (err) {
    console.error('🔥 Login error:', err);
    console.error('🔥 Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    setError(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Login to your GigFlow account</p>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
        
<div className="form-group">
  <label className="form-label" htmlFor="email">Email Address</label>
  <input
    type="email"
    id="email"
    name="email"
    autoComplete="email" 
    value={formData.email}
    onChange={handleChange}
    placeholder="Enter your email"
    required
    className="form-input"
  />
</div>

<div className="form-group">
  <label className="form-label" htmlFor="password">Password</label>
  <input
    type="password"
    id="password"
    name="password"
    autoComplete="current-password" 
    value={formData.password}
    onChange={handleChange}
    placeholder="Enter your password"
    required
    className="form-input"
  />
</div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-3">
          <p>Don't have an account? <Link to="/register" style={{ color: '#3498db' }}>Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;