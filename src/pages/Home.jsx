
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gigAPI, authAPI } from '../services/api';
import GigCard from '../components/GigCard';

function Home() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const user = authAPI.getCurrentUser();

  useEffect(() => {
    if (user) {
      setUserRole(user.role); 
    }
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      let response;
      
      
      if (user && user.role === 'client') {
    
        console.log('Client: Fetching all gigs');
        response = await gigAPI.getAllGigs();
      } else if (user && user.role === 'freelancer') {
     
        console.log('Freelancer: Fetching open gigs');
        response = await gigAPI.getOpenGigs();
      } else {
        
        console.log('Guest: Fetching open gigs');
        response = await gigAPI.getOpenGigs();
      }
      
      setGigs(response.data || []);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (user) {
     
      if (user.role === 'client') {
        navigate('/create-gig');
      } else if (user.role === 'freelancer') {
        navigate('/browse');
      } else {
        navigate('/browse');
      }
    } else {
      navigate('/register');
    }
  };


  const getFilteredGigs = () => {
    if (!user || user.role === 'client') {
      return gigs; 
    } else {
      
      return gigs;
    }
  };

  const filteredGigs = getFilteredGigs();
  const openGigsCount = gigs.filter(gig => gig.status === 'open').length;
  const totalGigsCount = gigs.length;

  return (

    <div 
  style={{
    minHeight: '100vh',
    background: `
      linear-gradient(135deg, 
        rgba(235, 236, 237, 0.9) 0%, 
        hsla(210, 23%, 74%, 0.90) 100%
      ),
      url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"),
      url("https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")
    `,
    backgroundSize: 'cover, cover, cover',
    backgroundPosition: 'center, left, right',
    backgroundBlendMode: 'overlay, multiply, normal',
    backgroundAttachment: 'fixed',
    color: 'white'
  }}
>
    <div className="container">
     
      <div className="hero">
        <h1 className="hero-title">
          {user?.role === 'client' ? 'Find Talent for Your Projects' : 
           user?.role === 'freelancer' ? 'Find Your Next Gig' : 
           'Find Work or Hire Talent'}
        </h1>
        
        <p className="hero-subtitle">
          {user?.role === 'client' ? 
            'Post gigs and hire skilled freelancers' : 
           user?.role === 'freelancer' ? 
            'Browse open projects and apply for work' : 
            'Connect with freelancers for your projects or find gigs to work on'}
        </p>
        
        <button onClick={handleGetStarted} className="btn btn-primary">
          {user?.role === 'client' ? 'Post a Gig' : 
           user?.role === 'freelancer' ? 'Browse Gigs' : 
           'Get Started'}
        </button>
      </div>

      
      <div className="grid grid-3 text-center mb-4">
        <div>
          <h3>
            {user?.role === 'client' ? totalGigsCount : openGigsCount}+
          </h3>
          <p>{user?.role === 'client' ? 'Total Gigs' : 'Open Gigs'}</p>
        </div>
        <div>
          <h3>24/7</h3>
          <p>Available</p>
        </div>
        <div>
          <h3>100%</h3>
          <p>Secure</p>
        </div>
      </div>


      <div className="mb-4">
        <h2 className="text-center mb-3">
          {user?.role === 'client' ? 'Recently Posted Gigs' : 
           user?.role === 'freelancer' ? 'Available Gigs' : 
           'Featured Gigs'}
        </h2>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : filteredGigs.length > 0 ? (
          <div>
           
            {user?.role === 'client' && (
              <div className="status-filter mb-2">
                <small>
                  Showing: {openGigsCount} open • {totalGigsCount - openGigsCount} assigned/completed
                </small>
              </div>
            )}
            
            <div className="grid grid-3 gap-2">
              {filteredGigs.slice(0, 6).map(gig => (
                <GigCard 
                  key={gig.id} 
                  gig={gig} 
                  showStatus={user?.role === 'client'} 
                  showApplyButton={!user || user.role === 'freelancer'} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            {user?.role === 'client' ? (
              <>
                <p>No gigs posted yet. Be the first!</p>
                <button 
                  onClick={() => navigate('/create-gig')} 
                  className="btn btn-primary mt-2"
                >
                  Post Your First Gig
                </button>
              </>
            ) : (
              <>
                <p>No open gigs available at the moment.</p>
                {user?.role === 'freelancer' && (
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="btn btn-primary mt-2"
                  >
                    Complete Your Profile
                  </button>
                )}
              </>
            )}
          </div>
        )}
        
        {filteredGigs.length > 0 && (
          <div className="text-center mt-3">
            <Link 
              to={user?.role === 'client' ? '/browse' : '/browse'} 
              className="btn btn-primary"
            >
              {user?.role === 'client' ? 'View All Gigs' : 'Browse All Gigs'}
            </Link>
          </div>
        )}
      </div>

     
      {!user ? (
        <div className="card text-center p-3" style={{ backgroundColor: '#2c3e50', color: 'white' }}>
          <h2 className="mb-2">Ready to get started?</h2>
          <p className="mb-3">Join thousands of clients and freelancers</p>
          <div className="flex-center gap-2">
            <Link to="/register?role=client">
              <button className="btn btn-danger">I want to hire</button>
            </Link>
            <Link to="/register?role=freelancer">
              <button className="btn btn-success">I want to work</button>
            </Link>
          </div>
        </div>
      ) : user.role === 'client' && gigs.length === 0 && (
        <div className="card text-center p-3" style={{ backgroundColor: '#f8f9fa', border: '2px dashed #007bff' }}>
          <h3 className="text-primary mb-2">Ready to find talent?</h3>
          <p>Post your first gig and start receiving proposals from freelancers.</p>
          <button 
            onClick={() => navigate('/create-gig')} 
            className="btn btn-primary"
          >
            Post Your First Gig
          </button>
        </div>
        
      )}
    </div>
    </div>
  );
}

export default Home;