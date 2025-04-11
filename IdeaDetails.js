import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaHandsHelping, 
  FaComments, 
  FaUsers, 
  FaShare, 
  FaBookmark,
  FaPencilAlt,
  FaCheck,
  FaPeopleArrows,
  FaRocket
} from 'react-icons/fa';

const IdeaDetails = () => {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Mock data loading - will be replaced with API calls
    setTimeout(() => {
      setIdea({
        id: id || '1',
        title: 'AI-Powered Personal Learning Assistant',
        description: 'An AI assistant that adapts to individual learning styles and helps students master complex subjects through personalized guidance.',
        status: 'Active',
        stage: 'Development',
        tags: ['Education', 'AI', 'EdTech', 'Machine Learning'],
        views: 245,
        likes: 42,
        comments: 15,
        date: '2 weeks ago',
        creator: {
          id: 'user-1',
          name: 'John Doe',
          avatar: 'https://via.placeholder.com/60',
          role: 'UX Designer & Developer',
          level: 5,
          bio: 'Passionate about creating user-centered digital experiences and solving complex problems through innovative technology solutions.'
        },
        stats: {
          innovation: 4.2,
          feasibility: 3.7,
          marketPotential: 4.8,
          impact: 4.3,
          overall: 4.2,
          support: 42,
          comments: 15,
          teamMembers: 4,
          completion: 35
        },
        problemStatement: 'Traditional education often follows a one-size-fits-all approach, which doesn\'t account for individual learning styles, paces, or preferences. This leads to inefficient learning experiences, knowledge gaps, and decreased motivation for many students.',
        solution: 'The AI-Powered Personal Learning Assistant is an intelligent platform that uses machine learning algorithms to understand each student\'s unique learning style, strengths, weaknesses, and preferences. It then creates personalized learning paths, adapts content delivery methods, and provides targeted feedback to optimize the learning experience.',
        features: [
          {
            title: 'Learning Style Assessment',
            description: 'Initial assessment to determine the student\'s preferred learning modalities (visual, auditory, reading/writing, kinesthetic).'
          },
          {
            title: 'Adaptive Content Delivery',
            description: 'Presents educational content in formats that match the student\'s learning style.'
          },
          {
            title: 'Progress Tracking',
            description: 'Monitors comprehension and retention through interactive quizzes and exercises.'
          },
          {
            title: 'Personalized Feedback',
            description: 'Provides specific, actionable feedback based on performance patterns.'
          },
          {
            title: 'Spaced Repetition',
            description: 'Schedules review sessions at optimal intervals to enhance long-term retention.'
          },
          {
            title: 'Concept Mapping',
            description: 'Visualizes connections between concepts to build comprehensive understanding.'
          },
          {
            title: 'Natural Language Interface',
            description: 'Allows students to ask questions and receive explanations in conversational language.'
          }
        ],
        targetMarket: {
          primary: 'K-12 and university students seeking to improve their learning efficiency and academic performance.',
          secondary: 'Adult learners pursuing professional development or acquiring new skills.'
        },
        technicalRequirements: [
          'Machine learning algorithms for learning style classification and content adaptation',
          'Natural language processing for conversational interface',
          'Content repository with multiple format versions of educational materials',
          'User-friendly interface accessible across devices (desktop, tablet, mobile)',
          'Data analytics dashboard for tracking progress and identifying patterns'
        ],
        currentStatus: 'We have completed the initial concept validation through user interviews and developed a prototype that demonstrates the core functionality. We are currently working on refining the machine learning algorithms and expanding the content repository. We\'re seeking team members with expertise in educational psychology, machine learning, and content development.',
        updates: [
          {
            title: 'Prototype Testing Results',
            content: 'We\'ve completed the first round of prototype testing with 25 students from various educational backgrounds. The results are promising:\n- 92% of participants found the learning style assessment accurate\n- 85% reported better understanding of concepts when presented in their preferred learning style\n- 78% expressed interest in using the platform regularly\n\nKey feedback for improvement includes enhancing the conversational interface and adding more interactive elements for kinesthetic learners.',
            date: '3 days ago'
          },
          {
            title: 'Partnership with Educational Content Provider',
            content: 'We\'re excited to announce a partnership with LearnSphere, a leading educational content provider. This collaboration will give us access to their extensive library of educational materials across various subjects, which we\'ll adapt for different learning styles within our platform.',
            date: '1 week ago'
          },
          {
            title: 'Algorithm Development Milestone',
            content: 'Our development team has achieved a significant milestone in refining the machine learning algorithms. The latest version shows a 35% improvement in accurately predicting learning style preferences based on user interactions, and a 28% improvement in content adaptation recommendations.',
            date: '2 weeks ago'
          }
        ],
        comments: [
          {
            id: 1,
            user: {
              name: 'Sarah Johnson',
              role: 'Environmental Engineer',
              level: 7,
              avatar: 'https://via.placeholder.com/40'
            },
            content: 'This is a fantastic idea! As someone who struggled with traditional teaching methods throughout school, I can see how valuable this would be. Have you considered incorporating environmental science topics into your content repository? I\'d be happy to contribute materials in that area.',
            likes: 5,
            date: '2 days ago'
          },
          {
            id: 2,
            user: {
              name: 'Michael Chen',
              role: 'AI Researcher',
              level: 6,
              avatar: 'https://via.placeholder.com/40'
            },
            content: 'I\'m curious about the technical implementation. What specific ML algorithms are you using for learning style classification? Have you considered using transformer models for the NLP component? I\'ve had success with BERT-based models for educational applications.',
            likes: 3,
            date: '4 days ago'
          },
          {
            id: 3,
            user: {
              name: 'John Doe',
              role: 'UX Designer',
              level: 5,
              avatar: 'https://via.placeholder.com/40'
            },
            content: '@Michael Chen Thanks for your interest! We\'re currently using a combination of supervised learning (Random Forest) for initial classification based on our assessment questionnaire, and reinforcement learning to refine the model based on user interactions and feedback. We are indeed using BERT for our NLP component, specifically a fine-tuned version for educational content. Would love to discuss this further - I\'ll send you a direct message!',
            likes: 2,
            date: '4 days ago'
          }
        ],
        team: {
          members: [
            {
              id: 1,
              name: 'John Doe',
              role: 'Project Lead & UX Designer',
              level: 5,
              avatar: 'https://via.placeholder.com/50',
              description: 'Responsible for overall project direction, user experience design, and team coordination.'
            },
            {
              id: 2,
              name: 'Michael Chen',
              role: 'AI Engineer',
              level: 6,
              avatar: 'https://via.placeholder.com/50',
              description: 'Leading the development of machine learning algorithms and natural language processing components.'
            },
            {
              id: 3,
              name: 'Elena Rodriguez',
              role: 'Educational Psychologist',
              level: 4,
              avatar: 'https://via.placeholder.com/50',
              description: 'Providing expertise on learning styles, educational content adaptation, and assessment methodologies.'
            },
            {
              id: 4,
              name: 'David Kim',
              role: 'Full Stack Developer',
              level: 8,
              avatar: 'https://via.placeholder.com/50',
              description: 'Implementing the technical infrastructure, database design, and user interface components.'
            }
          ],
          openPositions: [
            {
              id: 1,
              title: 'Content Developer',
              description: 'We\'re looking for someone to help develop and adapt educational content for different learning styles.'
            },
            {
              id: 2,
              title: 'UI/UX Designer',
              description: 'Seeking a designer to create engaging, accessible interfaces for diverse learning experiences.'
            }
          ]
        },
        similarIdeas: [
          {
            id: 1,
            title: 'Collaborative Learning Platform',
            description: 'A platform that connects students with similar learning goals for collaborative study sessions.',
            status: 'Active'
          },
          {
            id: 2,
            title: 'AR Educational Content',
            description: 'Augmented reality applications for interactive, immersive learning experiences.',
            status: 'In Progress'
          },
          {
            id: 3,
            title: 'Gamified Learning System',
            description: 'Educational platform that uses game mechanics to increase engagement and motivation.',
            status: 'Concept'
          }
        ],
        relatedSpaces: [
          {
            id: 1,
            title: 'EdTech Innovation Hub',
            description: 'Weekly discussions on the latest trends and innovations in educational technology.',
            participants: 12,
            status: 'Live'
          },
          {
            id: 2,
            title: 'AI in Education Workshop',
            description: 'Hands-on workshop exploring applications of artificial intelligence in educational settings.',
            date: 'Tomorrow, 3:00 PM',
            status: 'Scheduled'
          }
        ]
      });
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === '') return;
    
    // In a real app, this would send the comment to the backend
    // For now, we'll just log it
    console.log('Comment submitted:', comment);
    setComment('');
  };

  if (isLoading) {
    return <div className="loading">Loading idea details...</div>;
  }

  return (
    <div className="idea-details">
      {/* Idea Header */}
      <div className="idea-header">
        <div className="row">
          <div className="col-md-8">
            <div className="d-flex align-items-center mb-3">
              <span className="badge bg-success me-2">Active</span>
              <span className="text-muted">Posted {idea.date}</span>
              <span className="ms-auto">
                <i className="bi bi-eye me-1"></i> {idea.views} views
              </span>
            </div>
            <h2 className="mb-3">{idea.title}</h2>
            <div className="d-flex flex-wrap mb-3">
              {idea.tags.map((tag, index) => (
                <span key={index} className="badge-custom me-2 mb-2">{tag}</span>
              ))}
            </div>
            <p className="lead">{idea.description}</p>
            
            <div className="stage-indicator">
              <div className="stage">
                <div className="stage-dot completed">
                  <FaCheck />
                </div>
                <div className="stage-label">Concept</div>
              </div>
              <div className="stage">
                <div className="stage-dot completed">
                  <FaCheck />
                </div>
                <div className="stage-label">Validation</div>
              </div>
              <div className="stage">
                <div className="stage-dot active">
                  <FaPencilAlt />
                </div>
                <div className="stage-label">Development</div>
              </div>
              <div className="stage">
                <div className="stage-dot">
                  <FaUsers />
                </div>
                <div className="stage-label">Team Building</div>
              </div>
              <div className="stage">
                <div className="stage-dot">
                  <FaRocket />
                </div>
                <div className="stage-label">Launch</div>
              </div>
            </div>
            
            <div className="d-flex flex-wrap mt-4">
              <button className="btn btn-primary idea-action-btn">
                <FaHandsHelping className="me-2" /> Support ({idea.stats.support})
              </button>
              <button className="btn btn-outline-primary idea-action-btn">
                <FaComments className="me-2" /> Comment ({idea.stats.comments})
              </button>
              <button className="btn btn-outline-primary idea-action-btn">
                <FaUsers className="me-2" /> Join Team
              </button>
              <button className="btn btn-outline-primary idea-action-btn">
                <FaShare className="me-2" /> Share
              </button>
              <button className="btn btn-outline-primary idea-action-btn">
                <FaBookmark className="me-2" /> Save
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header">
                <i className="bi bi-person-circle me-2"></i> Idea Creator
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <img src={idea.creator.avatar} alt="Creator Avatar" className="rounded-circle me-3" />
                  <div>
                    <h6 className="mb-0">{idea.creator.name}</h6>
                    <p className="text-muted small mb-0">{idea.creator.role} <span className="level-indicator">Lv {idea.creator.level}</span></p>
                  </div>
                </div>
                <p className="small">{idea.creator.bio}</p>
                <button className="btn btn-sm btn-outline-primary w-100">
                  <i className="bi bi-chat-dots me-2"></i> Contact Creator
                </button>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <i className="bi bi-graph-up me-2"></i> Idea Stats
              </div>
              <d
(Content truncated due to size limit. Use line ranges to read in chunks)