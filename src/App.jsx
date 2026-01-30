import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';


import Navbar from './components/Navbar';


import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import BrowseGigs from './pages/BrowseGigs';
import Dashboard from './pages/Dashboard';
import CreateGig from './pages/CreateGig';
import GigDetail from './pages/GigDetail';

function PrivateRoute({ children }) {
  const user = authAPI.getCurrentUser();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse" element={<BrowseGigs />} />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/create-gig" element={
          <PrivateRoute>
            <CreateGig />
          </PrivateRoute>
        } />
        
        <Route path="/gig/:id" element={<GigDetail />} />
      </Routes>
    </Router>
  );
}

export default App;