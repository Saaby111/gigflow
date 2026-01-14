function Login() {
  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2 className="text-center">Login</h2>
      <form>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-input" placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-input" placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Login
        </button>
      </form>
      <p className="text-center mt-20">
        Don't have an account? <a href="/register" className="text-blue">Sign up</a>
      </p>
    </div>
  )
}

export default Login