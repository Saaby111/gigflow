import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI, gigAPI, bidAPI } from '../services/api';
import BidCard from '../components/BidCard';

function GigDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const user = authAPI.getCurrentUser();
  
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [bidForm, setBidForm] = useState({
    price: '',
    proposal: '',
  });
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    fetchGigDetails();
  }, [id]);

  const fetchGigDetails = async () => {
    try {
      setLoading(true);
      
   
      const gigResponse = await gigAPI.getGig(id);
      setGig(gigResponse.data);
      
   
      if (user && user.id === gigResponse.data.clientId) {
        const bidsResponse = await bidAPI.getBidsByGig(id);
        setBids(bidsResponse.data || []);
      }
    } catch (err) {
      console.error('Error fetching gig:', err);
      setError('Gig not found or you do not have access');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'freelancer') {
      setError('Only freelancers can submit bids');
      return;
    }
    
    setSubmittingBid(true);
    setError('');
    
    try {
      await bidAPI.submitBid({
        gigId: id,
        price: parseFloat(bidForm.price),
        proposal: bidForm.proposal, 
  deliveryTime: 7
      });
      
      setSuccess('Bid submitted successfully!');
      setBidForm({ price: '', message: '' });
      
    
      fetchGigDetails();
      
    } catch (err) {
      setError(err.response?.data?.proposal || 'Failed to submit bid');
    } finally {
      setSubmittingBid(false);
    }
  };


const handleHire = async (bidId) => {
  if (!window.confirm('Are you sure you want to hire this freelancer?')) {
    return;
  }
  
  try {
    setLoading(true);
    setError('');
    
    console.log('🤝 Hiring bid:', bidId);
    
  
    const response = await bidAPI.hireFreelancer(bidId);
    
    
    console.log('Hire response:', response);
    
    if (response.success) {
      setSuccess('Freelancer hired successfully!');
      
     
      setBids(prevBids => 
        prevBids.map(bid => {
          if (bid.id === bidId) {
            return { ...bid, status: 'hired' };
          }
          if (bid.gigId === gig?.id && bid.id !== bidId) {
            return { ...bid, status: 'rejected' };
          }
          return bid;
        })
      );
      
    
      if (gig) {
        setGig(prev => ({
          ...prev,
          status: 'assigned',
          assignedFreelancerId: response.data?.hiredBid?.freelancerId || bidId
        }));
      }
 
      setTimeout(() => {
        fetchGigDetails();
      }, 1000);
      
    } else {
      setError(response.message || 'Failed to hire freelancer');
    }
    
  } catch (err) {
    console.error('❌ Hire error:', err);
    console.error('❌ Error details:', err.response?.data);
    setError(err.response?.data?.message || 'Failed to hire freelancer');
  } finally {
    setLoading(false);
  }
};
  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="container">
        <div className="card text-center p-4">
          <h2>Gig Not Found</h2>
          <p className="mb-2">The gig you're looking for doesn't exist or has been removed.</p>
          <a href="/browse" className="btn btn-primary">Browse Other Gigs</a>
        </div>
      </div>
    );
  }

  const isGigOwner = user && user.id === gig.clientId;
  const isFreelancer = user && user.role === 'freelancer';
  const canBid = isFreelancer && gig.status === 'open';
  const hasBids = bids.length > 0;

  return (
    <div className="container">
     
      {success && (
        <div className="alert alert-success mb-3">
          {success}
        </div>
      )}
      
      {error && (
        <div className="form-error mb-3">
          {error}
        </div>
      )}

 
      <div className="card mb-3">
        <div className="flex-between mb-2">
          <div>
            <h1 className="mb-1">{gig.title}</h1>
            <div className="flex gap-2 mb-2">
              <span className="category-badge">{gig.category}</span>
              <span className={`status-badge status-${gig.status.toLowerCase().replace('_', '-')}`}>
                {gig.status}
              </span>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
              ${gig.budget}
            </div>
            {gig.deadline && (
              <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                Deadline: {new Date(gig.deadline).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <h3 className="mb-1">Description</h3>
          <div className="card-description" style={{ whiteSpace: 'pre-line' }}>
            {gig.description}
          </div>
        </div>

      
        {gig.requirements && (
          <div className="mb-3">
            <h3 className="mb-1">Requirements</h3>
            <div className="card-description" style={{ whiteSpace: 'pre-line' }}>
              {gig.requirements}
            </div>
          </div>
        )}

     
        <div className="grid grid-3 gap-2 mb-3">
          <div>
            <strong>Posted:</strong>
            <div>{new Date(gig.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <strong>Status:</strong>
            <div>{gig.status}</div>
          </div>
          <div>
            <strong>Category:</strong>
            <div>{gig.category}</div>
          </div>
        </div>

  
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/browse')}
            className="btn btn-outline"
          >
            ← Back to Gigs
          </button>
          
          {isGigOwner && gig.status === 'open' && (
            <a href={`/edit-gig/${id}`} className="btn btn-warning">
              Edit Gig
            </a>
          )}
        </div>
      </div>

     
      {isGigOwner && (
        <div className="card mb-3">
          <div className="flex-between mb-2">
            <h2>Bids Received ({bids.length})</h2>
            {gig.status === 'open' && hasBids && (
              <span className="status-badge status-open">Accepting Bids</span>
            )}
          </div>
          
          {hasBids ? (
            <div className="grid grid-2 gap-2">
              {bids.map(bid => (
                <BidCard 
                  key={bid.id} 
                  bid={bid}
                  isClient={true}
                  onHire={handleHire}
                  gigStatus={gig.status}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-4">
              <p>No bids received yet. Share your gig to get more visibility!</p>
            </div>
          )}
        </div>
      )}

     
      {canBid && (
        <div className="card mb-3">
          <h2 className="mb-2">Submit Your Bid</h2>
          <p className="mb-2">Place your bid for this gig. Make sure to include your price and a compelling message.</p>
          
          <form onSubmit={handleBidSubmit}>
            <div className="grid grid-2 gap-2 mb-2">
              <div className="form-group">
                <label className="form-label" htmlFor="price">Your Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={bidForm.price}
                  onChange={(e) => setBidForm({...bidForm, price: e.target.value})}
                  placeholder="e.g., 500"
                  required
                  min="1"
                  step="0.01"
                  className="form-input"
                />
                <small style={{ color: '#7f8c8d' }}>
                  Gig budget: ${gig.budget}
                </small>
              </div>
            </div>
            
            <div className="form-group mb-2">
              <label className="form-label" htmlFor="message">Your Proposal</label>
              <textarea
                id="proposal"
                name="proposal"
                value={bidForm.proposal}
                onChange={(e) => setBidForm({...bidForm, proposal: e.target.value})}
                placeholder="Tell the client why you're the best fit for this project..."
                required
                rows="4"
                className="form-input"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={submittingBid}
            >
              {submittingBid ? 'Submitting...' : 'Submit Bid'}
            </button>
          </form>
        </div>
      )}

   
      {gig.status === 'assigned' && gig.assignedFreelancerId && (
        <div className="card mb-3">
          <h2 className="mb-2">🎉 Gig Assigned</h2>
          <p>This gig has been assigned to a freelancer and is currently in progress.</p>
        </div>
      )}
      
      {gig.status === 'completed' && (
        <div className="card mb-3">
          <h2 className="mb-2">✅ Gig Completed</h2>
          <p>This gig has been successfully completed.</p>
        </div>
      )}

    
      {!user && gig.status === 'open' && (
        <div className="card mb-3 text-center">
          <h2 className="mb-2">Interested in this gig?</h2>
          <p className="mb-2">Login as a freelancer to submit your bid!</p>
          <div className="flex-center gap-2">
            <a href="/register?role=freelancer" className="btn btn-success">
              Sign Up as Freelancer
            </a>
            <a href="/login" className="btn btn-primary">
              Login
            </a>
          </div>
        </div>
      )}

   
      {isFreelancer && !canBid && gig.status === 'open' && (
        <div className="card mb-3">
          <h2 className="mb-2">You've already bid on this gig</h2>
          <p>Check your dashboard to see the status of your bid.</p>
          <a href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </a>
        </div>
      )}
    </div>
  );
}

export default GigDetail;