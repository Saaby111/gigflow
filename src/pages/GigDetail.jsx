function GigDetail() {
  return (
    <div>
      <div className="card">
        <h1 className="text-blue">Website Design for Coffee Shop</h1>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          I need a modern, responsive website for my coffee shop business with 5 pages including menu and contact.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4f46e5' }}>$500</div>
            <div style={{ color: '#666' }}>Budget</div>
          </div>
          <div>
            <span style={{ 
              padding: '5px 15px', 
              borderRadius: '20px', 
              backgroundColor: '#dcfce7',
              color: '#166534'
            }}>
              Open
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GigDetail