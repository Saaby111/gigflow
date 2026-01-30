import React from 'react';

function BidCard({ bid, isClient = false, onHire, gigStatus }) {
 
  if (!bid) {
    return (
      <div className="card">
        <div className="text-center p-3 text-muted">
          Bid data not available
        </div>
      </div>
    );
  }


  const getButtonText = () => {
    if (bid.status === 'hired') return '✓ Hired';
    if (bid.status === 'rejected') return '✗ Rejected';
    if (gigStatus === 'assigned') return 'Gig Assigned';
    return 'Hire';
  };


  const isHireDisabled = bid.status !== 'pending' || gigStatus === 'assigned';

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h4 className="card-title">{bid.freelancer?.name || 'Freelancer'}</h4>
          <p className="text-muted">
            {bid.freelancer?.email || 'No email provided'}
          </p>
        </div>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' }}>
          ${bid.price}
        </span>
      </div>
      
      <p className="card-description">{bid.proposal || bid.message || 'No proposal provided'}</p>
      
      {bid.deliveryTime && (
        <p className="text-muted small">
          Delivery: {bid.deliveryTime} days
        </p>
      )}
      
      <div className="flex-between mt-2">
        <span className={`status-badge status-${bid.status}`}>
          {bid.status}
        </span>
        
        {isClient && (
          <button 
            onClick={() => !isHireDisabled && onHire(bid.id)}
            className={`btn ${
              bid.status === 'hired' ? 'btn-success' :
              bid.status === 'rejected' ? 'btn-danger' :
              isHireDisabled ? 'btn-secondary' : 'btn-success'
            }`}
            disabled={isHireDisabled}
          >
            {getButtonText()}
          </button>
        )}
      </div>
      
      {bid.status === 'hired' && (
        <div className="mt-2 p-2 bg-success-light border-success rounded">
          <small className="text-success">
            🎉 This freelancer has been hired for this gig!
          </small>
        </div>
      )}
      
      {bid.status === 'rejected' && (
        <div className="mt-2 p-2 bg-danger-light border-danger rounded">
          <small className="text-danger">
            This bid was not selected for this gig.
          </small>
        </div>
      )}
    </div>
  );
}

export default BidCard;