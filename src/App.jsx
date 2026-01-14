import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import GigList from './pages/GigList'
import CreateGig from './pages/CreateGig'
import GigDetail from './pages/GigDetail'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        
        <main className="container mt-30">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gigs" element={<GigList />} />
            <Route path="/gigs/create" element={<CreateGig />} />
            <Route path="/gigs/:id" element={<GigDetail />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>© 2024 GigFlow. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App