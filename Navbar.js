import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaSearch, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  
  // Mock user data - will be replaced with context/API data
  const user = {
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/40',
    level: 5,
    progress: 70
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">IdeaXchange</Link>
        </div>
        
        <button className="navbar-toggler" onClick={toggleMobileMenu}>
          <FaBars />
        </button>
        
        <div className={`navbar-collapse ${showMobileMenu ? 'show' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/explore" className="nav-link">Explore</Link>
            </li>
            <li className="nav-item">
              <Link to="/virtual-space" className="nav-link">Virtual Spaces</Link>
            </li>
            <li className="nav-item">
              <Link to="/my-ideas" className="nav-link">My Ideas</Link>
            </li>
          </ul>
          
          <form className="search-form" onSubmit={handleSearch}>
            <input 
              type="search" 
              className="form-control" 
              placeholder="Search ideas, people, spaces..." 
            />
            <button type="submit" className="btn btn-outline-primary">
              <FaSearch />
            </button>
          </form>
          
          <div className="navbar-user">
            <div className="notification-icon">
              <FaBell />
              <span className="notification-badge">3</span>
            </div>
            
            <div className="user-profile">
              <img 
                src={user.avatar} 
                alt="User Avatar" 
                className="user-avatar" 
                onClick={() => navigate('/profile/me')}
              />
              <div className="user-info d-none-md">
                <div className="user-name">{user.name}</div>
                <div className="user-level">
                  <span className="level-indicator">Lv {user.level}</span>
                  <div className="progress-xp">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${user.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
