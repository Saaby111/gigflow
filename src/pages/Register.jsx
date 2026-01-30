import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const defaultRole = searchParams.get('role') || 'client'; 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole,
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
     
      const response = await authAPI.register(formData);
      console.log('✅ Registration response:', response);
      
      navigate('/browse');
    } catch (err) {
      console.error('❌ Registration error:', err); 
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  console.log('🔍 Current formData.role:', formData.role);

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join GigFlow as a <strong>{formData.role}</strong></p>
        
       
        <div style={{ 
          background: '#f8f9fa', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px',
          fontSize: '0.9rem'
        }}>
          <strong>Debug:</strong> Selected role: <code>{formData.role}</code>
        </div>

      
        <div className="grid grid-2 gap-2 mb-3">
          <button
            type="button"
            className={`btn ${formData.role === 'client' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              console.log('👔 Selected Client');
              setFormData({...formData, role: 'client'});
            }}
            style={{ flexDirection: 'column', height: '80px' }}
          >
            <span>👔 Client</span>
            <small style={{ fontSize: '0.8rem', opacity: 0.8 }}>I want to hire talent</small>
          </button>
          
          <button
            type="button"
            className={`btn ${formData.role === 'freelancer' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              console.log('💼 Selected Freelancer');
              setFormData({...formData, role: 'freelancer'});
            }}
            style={{ flexDirection: 'column', height: '80px' }}
          >
            <span>💼 Freelancer</span>
            <small style={{ fontSize: '0.8rem', opacity: 0.8 }}>I want to find work</small>
          </button>
        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

       
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength="6"
              className="form-input"
            />
            <small style={{ color: '#95a5a6', fontSize: '0.8rem' }}>Minimum 6 characters</small>
          </div>


          <input type="hidden" name="role" value={formData.role} />

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Sign Up as ${formData.role}`} 
          </button>
        </form>

      
        <div className="text-center mt-3">
          <p>Already have an account? <Link to="/login" style={{ color: '#3498db' }}>Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;