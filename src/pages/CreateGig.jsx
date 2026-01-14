function CreateGig() {
  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="text-center text-blue">Create a New Gig</h1>
      <form>
        <div className="form-group">
          <label className="form-label">Gig Title</label>
          <input type="text" className="form-input" placeholder="e.g., Website Designer Needed" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows="5" placeholder="Describe what you need..."></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Budget ($)</label>
          <input type="number" className="form-input" placeholder="500" />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <a href="/gigs" className="btn btn-secondary">Cancel</a>
          <button type="submit" className="btn btn-primary">Create Gig</button>
        </div>
      </form>
    </div>
  )
}

export default CreateGig