import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaVideo, FaComments, FaUsers, FaUserPlus, FaShare, FaEllipsisH } from 'react-icons/fa';

const VirtualSpace = () => {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('main');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Mock data loading - will be replaced with API calls
    setTimeout(() => {
      setSpace({
        id: id || '1',
        title: 'Sustainable Tech Brainstorming',
        description: 'A collaborative space for discussing and developing sustainable technology solutions that address environmental challenges.',
        status: 'Live',
        participants: 8,
        maxParticipants: 15,
        host: {
          id: 'host-1',
          name: 'Sarah Johnson',
          avatar: 'https://via.placeholder.com/40',
          role: 'Environmental Engineer'
        },
        tags: ['Sustainability', 'Technology', 'Innovation', 'Environment'],
        schedule: {
          nextSession: 'Today, 3:00 PM',
          duration: '1 hour',
          frequency: 'Weekly'
        },
        resources: [
          {
            id: 1,
            title: 'Sustainable Technology Framework',
            type: 'document',
            url: '#'
          },
          {
            id: 2,
            title: 'Environmental Impact Assessment Guide',
            type: 'pdf',
            url: '#'
          },
          {
            id: 3,
            title: 'Previous Session Recording',
            type: 'video',
            url: '#'
          }
        ],
        participants: [
          {
            id: 'user-1',
            name: 'John Doe',
            avatar: 'https://via.placeholder.com/40',
            role: 'UX Designer',
            status: 'online'
          },
          {
            id: 'user-2',
            name: 'Michael Chen',
            avatar: 'https://via.placeholder.com/40',
            role: 'AI Researcher',
            status: 'online'
          },
          {
            id: 'user-3',
            name: 'Elena Rodriguez',
            avatar: 'https://via.placeholder.com/40',
            role: 'UX Designer',
            status: 'away'
          },
          {
            id: 'user-4',
            name: 'David Kim',
            avatar: 'https://via.placeholder.com/40',
            role: 'Frontend Developer',
            status: 'online'
          },
          {
            id: 'user-5',
            name: 'Priya Sharma',
            avatar: 'https://via.placeholder.com/40',
            role: 'Data Scientist',
            status: 'offline'
          },
          {
            id: 'user-6',
            name: 'Marcus Johnson',
            avatar: 'https://via.placeholder.com/40',
            role: 'Product Manager',
            status: 'online'
          },
          {
            id: 'user-7',
            name: 'Lisa Wang',
            avatar: 'https://via.placeholder.com/40',
            role: 'Sustainability Consultant',
            status: 'online'
          }
        ],
        ideas: [
          {
            id: 'idea-1',
            title: 'Solar-Powered Water Purification System',
            description: 'A portable water purification system that uses solar energy to provide clean drinking water in remote areas.',
            author: {
              name: 'Sarah Johnson',
              avatar: 'https://via.placeholder.com/30'
            },
            votes: 12,
            comments: 5,
            status: 'Active'
          },
          {
            id: 'idea-2',
            title: 'Biodegradable Packaging from Agricultural Waste',
            description: 'Converting agricultural waste into biodegradable packaging materials to reduce plastic pollution.',
            author: {
              name: 'David Kim',
              avatar: 'https://via.placeholder.com/30'
            },
            votes: 8,
            comments: 3,
            status: 'New'
          },
          {
            id: 'idea-3',
            title: 'Smart Grid Optimization Algorithm',
            description: 'AI-powered algorithm to optimize energy distribution in smart grids, reducing waste and improving efficiency.',
            author: {
              name: 'Priya Sharma',
              avatar: 'https://via.placeholder.com/30'
            },
            votes: 15,
            comments: 7,
            status: 'Hot'
          }
        ]
      });

      // Mock chat messages
      setMessages([
        {
          id: 1,
          user: {
            id: 'host-1',
            name: 'Sarah Johnson',
            avatar: 'https://via.placeholder.com/40'
          },
          text: 'Welcome everyone to our weekly sustainable tech brainstorming session! Today we\'ll be focusing on water conservation technologies.',
          timestamp: '2:45 PM'
        },
        {
          id: 2,
          user: {
            id: 'user-2',
            name: 'Michael Chen',
            avatar: 'https://via.placeholder.com/40'
          },
          text: 'Looking forward to the discussion! I\'ve been researching some interesting developments in atmospheric water harvesting.',
          timestamp: '2:47 PM'
        },
        {
          id: 3,
          user: {
            id: 'user-4',
            name: 'David Kim',
            avatar: 'https://via.placeholder.com/40'
          },
          text: 'I\'ve shared a document in the resources section about recent innovations in water filtration technology that might be relevant.',
          timestamp: '2:50 PM'
        },
        {
          id: 4,
          user: {
            id: 'host-1',
            name: 'Sarah Johnson',
            avatar: 'https://via.placeholder.com/40'
          },
          text: 'Thanks David! Everyone, please take a few minutes to review the resources before we begin the main discussion.',
          timestamp: '2:52 PM'
        }
      ]);

      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      user: {
        id: 'current-user',
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40'
      },
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  if (isLoading) {
    return <div className="loading">Loading virtual space...</div>;
  }

  return (
    <div className="virtual-space">
      {/* Space Header */}
      <div className="space-header">
        <div className="row">
          <div className="col-md-8">
            <div className="d-flex align-items-center mb-2">
              <span className={`badge ${space.status === 'Live' ? 'bg-success' : 'bg-primary'} me-2`}>
                {space.status}
              </span>
              <span className="text-muted">
                Next session: {space.schedule.nextSession}
              </span>
            </div>
            <h3 className="mb-3">{space.title}</h3>
            <p>{space.description}</p>
            <div className="d-flex flex-wrap mb-3">
              {space.tags.map((tag, index) => (
                <span key={index} className="badge-custom me-2 mb-2">{tag}</span>
              ))}
            </div>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-4">
                <img 
                  src={space.host.avatar} 
                  alt="Host Avatar" 
                  className="rounded-circle me-2" 
                  width="30" 
                  height="30" 
                />
                <div>
                  <div className="small">Hosted by</div>
                  <div className="fw-bold">{space.host.name}</div>
                </div>
              </div>
              <div className="me-4">
                <div className="small">Participants</div>
                <div className="fw-bold">{space.participants.length}/{space.maxParticipants}</div>
              </div>
              <div>
                <div className="small">Duration</div>
                <div className="fw-bold">{space.schedule.duration}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <button className="btn btn-primary me-2">
              <FaVideo className="me-2" /> Join Video
            </button>
            <button className="btn btn-outline-primary me-2">
              <FaShare className="me-2" /> Share
            </button>
            <button className="btn btn-outline-secondary">
              <FaEllipsisH />
            </button>
          </div>
        </div>
      </div>

      {/* Space Tabs */}
      <ul className="nav nav-tabs mt-4" id="spaceTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'main' ? 'active' : ''}`} 
            onClick={() => setActiveTab('main')}
          >
            Main Room
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'ideas' ? 'active' : ''}`} 
            onClick={() => setActiveTab('ideas')}
          >
            Ideas
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'participants' ? 'active' : ''}`} 
            onClick={() => setActiveTab('participants')}
          >
            Participants
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`} 
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
        </li>
      </ul>

      <div className="tab-content" id="spaceTabsContent">
        {/* Main Room Tab */}
        {activeTab === 'main' && (
          <div className="tab-pane fade show active">
            <div className="row">
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-body p-0">
                    <div className="video-container">
                      {/* This would be replaced with actual video conferencing component */}
                      <div className="video-placeholder d-flex flex-column align-items-center justify-content-center">
                        <FaVideo size={48} className="mb-3 text-muted" />
                        <h5>Video Conference</h5>
                        <p className="text-muted">Click "Join Video" to start or join the video conference</p>
                        <button className="btn btn-primary">
                          <FaVideo className="me-2" /> Join Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <i className="bi bi-lightbulb me-2"></i> Current Topic
                  </div>
                  <div className="card-body">
                    <h5>Water Conservation Technologies</h5>
                    <p>Exploring innovative solutions for water conservation, purification, and sustainable management in urban and rural environments.</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge bg-info me-2">Discussion</span>
                        <span className="text-muted small">30 minutes remaining</span>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-plus-circle me-2"></i> Add Idea
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card chat-card">
                  <div className="card-header">
                    <FaComments className="me-2" /> Chat
                  </div>
                  <div className="card-body p-0">
                    <div className="chat-messages">
                      {messages.map(message => (
                        <div key={message.id} className={`chat-message ${message.user.id === 'current-user' ? 'chat-message-own' : ''}`}>
                          <div className="chat-message-avatar">
                            <img src={message.user.avatar} alt="User Avatar" className="rounded-circle" />
                          </div>
                          <div className="chat-message-content">
                            <div className="chat-message-header">
                              <span className="chat-message-author">{message.user.name}</span>
                              <span className="chat-message-time">{message.timestamp}</span>
                            </div>
                            <div className="chat-message-text">{message.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="chat-input">
                      <form onSubmit={handleSendMessage}>
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Type your message..." 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <button type="submit" className="btn btn-primary">Send</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ideas Tab */}
        {activeTab === 'ideas' && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Shared Ideas</h5>
              <button className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i> Add New Idea
              </button>
            </div>
            <div className="row">
              {space.ideas.map(idea => (
                <div key={idea.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card idea-card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <img src={idea.author.avatar} alt="User Avatar" className="rounded-circle me-2" width="30" height="30" />
                          <span>{idea.author.name}</span>
                        </div>
                        <span className={`badge ${
                          idea.status === 'Active' ? 'bg-success' : 
                          idea.status === 'Hot' ? 'bg-warning' : 
                          'bg-info'
                        }`}>{idea.status}</span>
                      </div>
                      <h6 className="card-title">{idea.title}</h6>
                      <p className="card-text text-muted small">{idea.description}</p>
                      <div className="d-flex justify-content-
(Content truncated due to size limit. Use line ranges to read in chunks)