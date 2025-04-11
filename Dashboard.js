import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLightbulb, FaUsers, FaCalendarAlt, FaSearch, FaPlusCircle } from 'react-icons/fa';

const Dashboard = () => {
  // Mock data - will be replaced with API calls
  const [trendingIdeas, setTrendingIdeas] = useState([]);
  const [activeSpaces, setActiveSpaces] = useState([]);
  const [recommendedConnections, setRecommendedConnections] = useState([]);
  const [userStats, setUserStats] = useState({
    xp: 1250,
    nextLevel: 1500,
    progress: 75,
    ideas: 12,
    connections: 48,
    projects: 5
  });

  useEffect(() => {
    // Mock data loading - will be replaced with API calls
    setTrendingIdeas([
      {
        id: 1,
        title: 'Sustainable Urban Farming Solution',
        description: 'A network of community-managed vertical farms to provide fresh produce in urban food deserts.',
        user: {
          name: 'Sarah Johnson',
          avatar: 'https://via.placeholder.com/30'
        },
        tags: ['Sustainability', 'Agriculture', 'Community'],
        likes: 24,
        comments: 8,
        status: 'New'
      },
      {
        id: 2,
        title: 'AI-Powered Language Learning Platform',
        description: 'Personalized language learning using AI to adapt to individual learning styles and pace.',
        user: {
          name: 'Michael Chen',
          avatar: 'https://via.placeholder.com/30'
        },
        tags: ['Education', 'AI', 'Languages'],
        likes: 42,
        comments: 15,
        status: 'Hot'
      },
      {
        id: 3,
        title: 'Mental Health Support Network',
        description: 'Peer-to-peer mental health support platform with verified professionals for guidance.',
        user: {
          name: 'Elena Rodriguez',
          avatar: 'https://via.placeholder.com/30'
        },
        tags: ['Health', 'Community', 'Support'],
        likes: 56,
        comments: 23,
        status: 'Funded'
      }
    ]);

    setActiveSpaces([
      {
        id: 1,
        title: 'Sustainable Tech Brainstorming',
        description: 'Join our weekly brainstorming session on sustainable technology solutions.',
        participants: 8,
        status: 'Live'
      },
      {
        id: 2,
        title: 'UX Design Workshop',
        description: 'Learn practical UX design techniques from industry experts. Starting in 2 hours.',
        participants: 12,
        status: 'Scheduled'
      }
    ]);

    setRecommendedConnections([
      {
        id: 1,
        name: 'David Kim',
        role: 'UX Designer & Developer',
        avatar: 'https://via.placeholder.com/50',
        tags: ['UX Design', 'Frontend', 'React'],
        match: 85
      },
      {
        id: 2,
        name: 'Priya Sharma',
        role: 'Data Scientist',
        avatar: 'https://via.placeholder.com/50',
        tags: ['AI', 'Machine Learning', 'Python'],
        match: 78
      },
      {
        id: 3,
        name: 'Marcus Johnson',
        role: 'Sustainability Consultant',
        avatar: 'https://via.placeholder.com/50',
        tags: ['Sustainability', 'Green Energy', 'Consulting'],
        match: 72
      }
    ]);
  }, []);

  return (
    <div className="dashboard">
      {/* Welcome Card */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Welcome back, John!</h5>
          <p className="card-text">Continue working on your ideas or explore new opportunities to collaborate.</p>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/new-idea" className="btn btn-primary">
              <FaPlusCircle className="mr-2" /> New Idea
            </Link>
            <Link to="/explore" className="btn btn-outline-primary">
              <FaSearch className="mr-2" /> Explore Ideas
            </Link>
            <Link to="/network" className="btn btn-outline-primary">
              <FaUsers className="mr-2" /> Find Collaborators
            </Link>
          </div>
        </div>
      </div>

      {/* Trending Ideas */}
      <div className="mb-4">
        <h5>Trending Ideas</h5>
        <div className="row">
          {trendingIdeas.map(idea => (
            <div key={idea.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card idea-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <img src={idea.user.avatar} alt="User Avatar" className="rounded-circle mr-2" width="30" height="30" />
                      <span>{idea.user.name}</span>
                    </div>
                    <span className={`badge ${
                      idea.status === 'New' ? 'bg-info' : 
                      idea.status === 'Hot' ? 'bg-warning' : 
                      'bg-success'
                    }`}>{idea.status}</span>
                  </div>
                  <h6 className="card-title">{idea.title}</h6>
                  <p className="card-text text-muted small">{idea.description}</p>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {idea.tags.map((tag, index) => (
                      <span key={index} className="badge badge-custom">{tag}</span>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-heart mr-1"></i> {idea.likes}
                      <i className="bi bi-chat-dots ms-2 mr-1"></i> {idea.comments}
                    </div>
                    <Link to={`/idea/${idea.id}`} className="btn btn-sm btn-outline-primary">View Details</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Virtual Spaces */}
      <div className="mb-4">
        <h5>Active Virtual Spaces</h5>
        <div className="row">
          {activeSpaces.map(space => (
            <div key={space.id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="card-title mb-0">{space.title}</h6>
                    <span className={`badge ${space.status === 'Live' ? 'bg-success' : 'bg-primary'}`}>{space.status}</span>
                  </div>
                  <p className="card-text text-muted small">{space.description}</p>
                  <div className="d-flex align-items-center mb-3">
                    <div className="d-flex">
                      {/* This would be replaced with actual participant avatars */}
                      <img src="https://via.placeholder.com/30" alt="User Avatar" className="rounded-circle border border-white" style={{ marginLeft: '-5px' }} />
                      <img src="https://via.placeholder.com/30" alt="User Avatar" className="rounded-circle border border-white" style={{ marginLeft: '-5px' }} />
                      <img src="https://via.placeholder.com/30" alt="User Avatar" className="rounded-circle border border-white" style={{ marginLeft: '-5px' }} />
                    </div>
                    <span className="ms-2 text-muted small">{space.participants} participants</span>
                  </div>
                  <Link to={`/virtual-space/${space.id}`} className={`btn w-100 ${space.status === 'Live' ? 'btn-success' : 'btn-outline-primary'}`}>
                    {space.status === 'Live' ? 'Join Now' : 'Register'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Connections */}
      <div className="mb-4">
        <h5>Recommended Connections</h5>
        <div className="row">
          {recommendedConnections.map(connection => (
            <div key={connection.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img src={connection.avatar} alt="User Avatar" className="rounded-circle mr-3" width="50" height="50" />
                    <div>
                      <h6 className="mb-0">{connection.name}</h6>
                      <p className="text-muted small mb-0">{connection.role}</p>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {connection.tags.map((tag, index) => (
                      <span key={index} className="badge badge-custom">{tag}</span>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">{connection.match}% match</span>
                    <button className="btn btn-sm btn-outline-primary">Connect</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
