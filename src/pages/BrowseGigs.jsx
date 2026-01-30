import React, { useEffect, useState } from 'react';
import { gigAPI, authAPI } from '../services/api';
import GigCard from '../components/GigCard';

function BrowseGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const user = authAPI.getCurrentUser();

  useEffect(() => {
    fetchGigs();
  }, []);
const fetchGigs = async () => {
  try {
    if (user && user.role === 'client') {
      
      const response = await gigAPI.getAllGigs();
      setGigs(response.data || []);
    } else {
      
      try {
        
        const response = await gigAPI.getOpenGigs();
        setGigs(response.data || []);
      } catch (openGigsError) {
        console.log('getOpenGigs not available, falling back to filter method');
        
        const response = await gigAPI.getAllGigs();
        const allGigs = response.data || [];
        const openGigs = allGigs.filter(gig => gig.status === 'open');
        setGigs(openGigs);
      }
    }
  } catch (error) {
    console.error('Error fetching gigs:', error);
  } finally {
    setLoading(false);
  }
};

  
  const filteredGigs = gigs.filter(gig => {
    if (filter === 'all') return true;
    if (filter === 'open') return gig.status === 'open';
    if (filter === 'assigned') return gig.status === 'assigned';
    if (filter === 'completed') return gig.status === 'completed';
    return true;
  });

  return (
    <div className="container">
      <div className="flex-between mb-3">
        <h1>Browse Gigs</h1>
        {user?.role === 'client' && (
          <a href="/create-gig" className="btn btn-primary">+ Post a Gig</a>
        )}
      </div>

      
      <div className="flex gap-2 mb-3">
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
        >
          All Gigs
        </button>
        <button 
          className={`btn ${filter === 'open' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('open')}
        >
          Open Only
        </button>
        {user?.role === 'client' && (
          <>
            <button 
              className={`btn ${filter === 'assigned' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('assigned')}
            >
              Assigned
            </button>
            <button 
              className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </>
        )}
      </div>

      

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : filteredGigs.length > 0 ? (
        <div className="grid grid-3 gap-2">
          {filteredGigs.map(gig => (
            <GigCard 
              key={gig.id} 
              gig={gig}
              
              showStatus={user?.role === 'client'} 
              showApplyButton={user?.role === 'freelancer' || !user} 
              showOwner={user?.role === 'freelancer' || !user} 
            />
          ))}
        </div>
      ) : (
        <div className="card text-center p-4">
          <h3>No gigs found</h3>
          {user?.role === 'freelancer' ? (
            <p>No open gigs available at the moment. Check back later!</p>
          ) : (
            <p>Try changing your filters or check back later</p>
          )}
        </div>
      )}
    </div>
  );
}

export default BrowseGigs;