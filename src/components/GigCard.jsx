import React from 'react';
import { Link } from 'react-router-dom';

function GigCard({ gig }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{gig.title}</h3>
        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3498db' }}>
          ${gig.budget}
        </span>
      </div>
      
      <p className="card-description">
        {gig.description.length > 100 
          ? gig.description.substring(0, 100) + '...' 
          : gig.description}
      </p>
      
      <div className="flex-between mb-2">
        <span className="category-badge">{gig.category}</span>
        <span className={`status-badge status-${gig.status.toLowerCase().replace('_', '-')}`}>
          {gig.status}
        </span>
      </div>
      
     
    
<div className="text-right">
  <Link to={`/gig/${gig.id}`} className="btn btn-primary">
    View Details
  </Link>
</div>
    </div>
  );
}

export default GigCard;