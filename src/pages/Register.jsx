function Register() {
  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2 className="text-center">Create Account</h2>
      <form>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-input" placeholder="••••••••" />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input type="password" className="form-input" placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Create Account
        </button>
      </form>
      <p className="text-center mt-20">
        Already have an account? <a href="/login" className="text-blue">Login</a>
      </p>
    </div>
  )
}

export default Register