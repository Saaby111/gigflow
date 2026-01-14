function GigList() {
  const gigs = [
    { id: 1, title: 'Website Design', description: 'Need a modern website for my business', budget: 500, status: 'Open' },
    { id: 2, title: 'Logo Design', description: 'Create a modern logo for tech startup', budget: 200, status: 'Open' },
    { id: 3, title: 'Social Media Manager', description: 'Manage Instagram and Facebook pages', budget: 300, status: 'Assigned' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="text-blue">Available Gigs</h1>
        <a href="/gigs/create" className="btn btn-primary">+ Post a Gig</a>
      </div>

      <div className="gig-grid">
        {gigs.map(gig => (
          <div key={gig.id} className="card">
            <h3>{gig.title}</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>{gig.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>
                ${gig.budget}
              </span>
              <span style={{ 
                padding: '5px 10px', 
                borderRadius: '20px', 
                backgroundColor: gig.status === 'Open' ? '#dcfce7' : '#fee2e2',
                color: gig.status === 'Open' ? '#166534' : '#991b1b'
              }}>
                {gig.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GigList