import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Page components
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import VirtualSpace from './pages/VirtualSpace';
import IdeaDetails from './pages/IdeaDetails';
import ExploreIdeas from './pages/ExploreIdeas';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <div className="content-container">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/profile/:id" element={<UserProfile />} />
                  <Route path="/virtual-space/:id" element={<VirtualSpace />} />
                  <Route path="/idea/:id" element={<IdeaDetails />} />
                  <Route path="/explore" element={<ExploreIdeas />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
