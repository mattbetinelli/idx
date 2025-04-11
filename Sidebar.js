import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaLightbulb, 
  FaUser, 
  FaUsers, 
  FaThLarge, 
  FaCalendarAlt, 
  FaComments, 
  FaTrophy, 
  FaCog, 
  FaPlusCircle 
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  
  // Define sidebar items
  const sidebarItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/my-ideas', icon: <FaLightbulb />, label: 'My Ideas' },
    { path: '/profile/me', icon: <FaUser />, label: 'My Profile' },
    { path: '/network', icon: <FaUsers />, label: 'My Network' },
    { path: '/virtual-spaces', icon: <FaThLarge />, label: 'Virtual Spaces' },
    { path: '/explore', icon: <FaLightbulb />, label: 'Explore Ideas' },
    { path: '/events', icon: <FaCalendarAlt />, label: 'Events' },
    { path: '/messages', icon: <FaComments />, label: 'Messages' },
    { path: '/achievements', icon: <FaTrophy />, label: 'Achievements' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-items">
        {sidebarItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.path} 
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="sidebar-action">
        <button className="btn btn-primary w-100">
          <FaPlusCircle className="mr-2" /> New Idea
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
