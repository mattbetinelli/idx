import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaPencilAlt, FaCheck, FaPeople, FaRocket, FaHandsHelping, FaComments, FaPeopleArrows, FaShare, FaBookmark } from 'react-icons/fa';

const UserProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading - will be replaced with API calls
    setTimeout(() => {
      setUserProfile({
        id: id === 'me' ? 'current-user' : id,
        name: 'John Doe',
        role: 'UX Designer & Full Stack Developer',
        avatar: 'https://via.placeholder.com/120',
        level: 5,
        xp: 1250,
        nextLevelXp: 1500,
        progress: 75,
        bio: 'Passionate about creating user-centered digital experiences and solving complex problems through innovative technology solutions.',
        stats: {
          ideas: 12,
          projects: 5,
          connections: 48,
          reputation: 820
        },
        skills: [
          { name: 'UX Design', level: 'Advanced' },
          { name: 'UI Development', level: 'Advanced' },
          { name: 'React.js', level: 'Advanced' },
          { name: 'Node.js', level: 'Intermediate' },
          { name: 'TypeScript', level: 'Intermediate' },
          { name: 'MongoDB', level: 'Intermediate' },
          { name: 'User Research', level: 'Advanced' },
          { name: 'Wireframing', level: 'Advanced' },
          { name: 'Prototyping', level: 'Advanced' }
        ],
        interests: [
          'Sustainable Technology',
          'AI & Machine Learning',
          'Education Tech',
          'Health & Wellness',
          'Smart Cities',
          'Blockchain'
        ],
        experience: [
          {
            title: 'Senior UX Designer',
            company: 'TechInnovate Inc.',
            period: '2022 - Present',
            description: 'Leading UX design for enterprise SaaS products, conducting user research, and implementing design systems.'
          },
          {
            title: 'Full Stack Developer',
            company: 'WebSolutions Co.',
            period: '2019 - 2022',
            description: 'Developed responsive web applications using React.js and Node.js, implemented RESTful APIs and database solutions.'
          },
          {
            title: 'UI/UX Designer',
            company: 'DigitalCraft Agency',
            period: '2017 - 2019',
            description: 'Created user interfaces for mobile and web applications, conducted usability testing and iterative design improvements.'
          }
        ],
        education: [
          {
            degree: 'Master of Human-Computer Interaction',
            institution: 'Stanford University',
            period: '2015 - 2017'
          },
          {
            degree: 'Bachelor of Computer Science',
            institution: 'MIT',
            period: '2011 - 2015'
          }
        ],
        ideas: [
          {
            id: 1,
            title: 'AI-Powered Personal Learning Assistant',
            description: 'An AI assistant that adapts to individual learning styles and helps students master complex subjects through personalized guidance.',
            tags: ['Education', 'AI', 'EdTech'],
            status: 'Active',
            likes: 42,
            comments: 15,
            date: '2 weeks ago'
          },
          {
            id: 2,
            title: 'Smart Urban Mobility Platform',
            description: 'An integrated platform that combines public transit, ride-sharing, and micro-mobility options to optimize urban transportation.',
            tags: ['Smart Cities', 'Mobility', 'Sustainability'],
            status: 'In Progress',
            likes: 36,
            comments: 12,
            date: '1 month ago'
          },
          {
            id: 3,
            title: 'Mental Wellness Companion App',
            description: 'A holistic mental wellness app that combines mood tracking, guided meditation, and on-demand professional support.',
            tags: ['Health', 'Wellness', 'Mental Health'],
            status: 'Draft',
            likes: 0,
            comments: 0,
            date: 'Last edited 3 days ago'
          }
        ],
        projects: [
          {
            id: 1,
            title: 'EcoTrack: Sustainability Monitoring',
            description: 'A platform for businesses to track and optimize their environmental impact through real-time data analytics.',
            status: 'Active',
            progress: 75,
            deadline: 'June 15, 2025',
            teamSize: 6
          },
          {
            id: 2,
            title: 'LearnHub: Interactive Learning Platform',
            description: 'An interactive learning platform that combines video lessons, quizzes, and collaborative projects for effective skill development.',
            status: 'In Progress',
            progress: 45,
            deadline: 'August 30, 2025',
            teamSize: 3
          }
        ],
        achievements: [
          {
            id: 1,
            title: 'Idea Generator',
            description: 'Created 10+ ideas',
            icon: 'lightbulb'
          },
          {
            id: 2,
            title: 'Connector',
            description: 'Built a network of 50+ connections',
            icon: 'people'
          },
          {
            id: 3,
            title: 'Active Contributor',
            description: 'Provided valuable feedback on 25+ ideas',
            icon: 'chat'
          },
          {
            id: 4,
            title: 'Project Launcher',
            description: 'Successfully launched 3 projects',
            icon: 'rocket'
          }
        ],
        connections: [
          {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Environmental Engineer',
            avatar: 'https://via.placeholder.com/50',
            tags: ['Sustainability', 'Green Energy'],
            date: '3 months ago',
            status: 'online'
          },
          {
            id: 2,
            name: 'Michael Chen',
            role: 'AI Researcher',
            avatar: 'https://via.placeholder.com/50',
            tags: ['AI', 'Machine Learning'],
            date: '1 year ago',
            status: 'online'
          },
          {
            id: 3,
            name: 'Elena Rodriguez',
            role: 'UX Designer',
            avatar: 'https://via.placeholder.com/50',
            tags: ['UX Design', 'User Research'],
            date: '6 months ago',
            status: 'away'
          },
          {
            id: 4,
            name: 'David Kim',
            role: 'Frontend Developer',
            avatar: 'https://via.placeholder.com/50',
            tags: ['React', 'TypeScript'],
            date: '2 months ago',
            status: 'offline'
          },
          {
            id: 5,
            name: 'Priya Sharma',
            role: 'Data Scientist',
            avatar: 'https://via.placeholder.com/50',
            tags: ['Data Analysis', 'Python'],
            date: '4 months ago',
            status: 'online'
          },
          {
            id: 6,
            name: 'Marcus Johnson',
            role: 'Product Manager',
            avatar: 'https://via.placeholder.com/50',
            tags: ['Product Strategy', 'Agile'],
            date: '8 months ago',
            status: 'offline'
          }
        ]
      });
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="user-profile">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="row">
          <div className="col-md-2 text-center text-md-start">
            <img src={userProfile.avatar} alt="Profile Avatar" className="profile-avatar" />
          </div>
          <div className="col-md-7">
            <div className="d-flex align-items-center mb-2">
              <h3 className="mb-0 mr-3">{userProfile.name}</h3>
              <span className="level-indicator">Level {userProfile.level}</span>
            </div>
            <p className="text-muted">{userProfile.role}</p>
            <p>{userProfile.bio}</p>
            <div className="d-flex align-items-center mt-3">
              <div className="mr-4">
                <div className="fw-bold">{userProfile.xp} XP</div>
                <div className="small text-muted">Next level: {userProfile.nextLevelXp} XP</div>
              </div>
              <div className="flex-grow-1" style={{ maxWidth: '200px' }}>
                <div className="progress progress-xp">
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${userProfile.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 text-md-end mt-3 mt-md-0">
            {id === 'me' && (
              <button className="btn btn-outline-primary mb-2">
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            )}
            {id !== 'me' && (
              <button className="btn btn-primary mb-2">
                <FaHandsHelping className="mr-2" /> Connect
              </button>
            )}
          </div>
        </div>
        
        <div className="profile-stats mt-4">
          <div className="profile-stat-item">
            <div className="profile-stat-value">{userProfile.stats.ideas}</div>
            <div className="profile-stat-label">Ideas</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-value">{userProfile.stats.projects}</div>
            <div className="profile-stat-label">Projects</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-value">{userProfile.stats.connections}</div>
            <div className="profile-stat-label">Connections</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-value">{userProfile.stats.reputation}</div>
            <div className="profile-stat-label">Reputation</div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <ul className="nav nav-tabs" id="profileTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'about' ? 'active' : ''}`} 
            onClick={() => setActiveTab('about')}
          >
            About
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
            className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`} 
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'achievements' ? 'active' : ''}`} 
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'connections' ? 'active' : ''}`} 
            onClick={() => setActiveTab('connections')}
          >
            Connections
          </button>
        </li>
      </ul>

      <div className="tab-content" id="profileTabsContent">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="tab-pane fade show active">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <i className="bi bi-tools mr-2"></i> Skills
                  </div>
                  <div className="card-body">
                    <div className="d-flex flex-wrap">
                      {userProfile.skills.map((skill, index) => (
                        <span key={index} className="badge-custom skill-badge">
                          <i className="bi bi-check-circle-fill mr-1"></i> {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <i className="bi bi-heart mr-2"></i> Interests
                  </div>
                  <div className="card-body">
                    <div className="d-flex flex-wrap">
                      {userProfile.interests.map((interest, index) => (
                        <span key={index} className="badge-custom interest-badge">
                          <i className="bi bi-star-fill mr-1"></i> {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <i className="bi bi-briefcase mr-2"></i> Experience
                  </div>
                  <div className="card-body">
                    {userProfile.experience.map((exp, index) => (
                      <div key={index} className={index < userProfile.experience.length - 1 ? 'mb-4' : ''}>
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-1">{exp.title}</h6>
                          <span className="text-muted small">{exp.period}</span>
                        </div>
                        <div className="text-muted mb-2">{exp.company}</div>
                        <p className="small">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <i className="bi bi-mortarboard mr-2"></i> Education
                  </div>
                  <div className="card-body">
                    {userProfile.education.map((edu, index) => (
                      <div key={index} className={index < userProfile.education.length - 1 ? 'mb-4' : ''}>
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-1">{edu.degree}</h6>
                          <span className="text-muted small">{edu.period}</span>
                        </div>
                        <div className="text-muted">{edu.institution}</div>
                      </div>
                    ))}
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
              <h5 className="mb-0">My Ideas</h5>
              <button className="btn btn-primary">
                <FaPlusCircle className="mr-2" /> New Idea
              </button>
            </div>
            <div className="row">
              {userProfile.ideas.map(idea => (
                <div key={idea.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card idea-card h-100">
                    <div className="card
(Content truncated due to size limit. Use line ranges to read in chunks)