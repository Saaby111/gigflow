function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <a href="/" className="nav-logo">GigFlow</a>
          <div className="nav-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/gigs" className="nav-link">Browse Gigs</a>
            <a href="/login" className="nav-link">Login</a>
            <a href="/register" className="btn btn-primary">Sign Up</a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar