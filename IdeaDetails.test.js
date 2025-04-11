import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IdeaDetails from '../src/pages/IdeaDetails';

// Mock the API calls
jest.mock('../src/services/api', () => ({
  getIdeaById: jest.fn().mockResolvedValue({
    data: {
      id: '1',
      title: 'Test Idea',
      description: 'This is a test idea description',
      problemStatement: 'This is a test problem statement',
      solution: 'This is a test solution',
      creator: { 
        id: '101', 
        name: 'Creator User', 
        avatar: 'https://via.placeholder.com/40',
        level: 5
      },
      team: [
        { id: '101', name: 'Creator User', role: 'Leader', avatar: 'https://via.placeholder.com/40' },
        { id: '102', name: 'Team Member 1', role: 'Developer', avatar: 'https://via.placeholder.com/40' }
      ],
      tags: ['test', 'innovation', 'technology'],
      stage: 'Development',
      createdAt: '2025-03-10T09:00:00Z',
      updatedAt: '2025-04-05T14:30:00Z',
      likes: ['201', '202', '203'],
      ratings: [
        { user: '201', innovation: 4, feasibility: 3, marketPotential: 5, impact: 4, overall: 4 },
        { user: '202', innovation: 5, feasibility: 4, marketPotential: 4, impact: 5, overall: 4.5 }
      ],
      comments: [
        { 
          id: '301', 
          user: { id: '201', name: 'Commenter 1', avatar: 'https://via.placeholder.com/40' },
          text: 'This is a great idea!',
          createdAt: '2025-03-15T10:15:00Z'
        },
        { 
          id: '302', 
          user: { id: '202', name: 'Commenter 2', avatar: 'https://via.placeholder.com/40' },
          text: 'I would suggest adding more details about implementation.',
          createdAt: '2025-03-20T16:45:00Z'
        }
      ]
    }
  }),
  addComment: jest.fn().mockResolvedValue({
    success: true,
    data: [
      { 
        id: '301', 
        user: { id: '201', name: 'Commenter 1', avatar: 'https://via.placeholder.com/40' },
        text: 'This is a great idea!',
        createdAt: '2025-03-15T10:15:00Z'
      },
      { 
        id: '302', 
        user: { id: '202', name: 'Commenter 2', avatar: 'https://via.placeholder.com/40' },
        text: 'I would suggest adding more details about implementation.',
        createdAt: '2025-03-20T16:45:00Z'
      },
      { 
        id: '303', 
        user: { id: '1', name: 'Test User', avatar: 'https://via.placeholder.com/40' },
        text: 'New test comment',
        createdAt: '2025-04-11T21:53:00Z'
      }
    ]
  }),
  likeIdea: jest.fn().mockResolvedValue({
    success: true,
    data: ['201', '202', '203', '1']
  }),
  rateIdea: jest.fn().mockResolvedValue({
    success: true
  })
}));

// Mock the context
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      name: 'Test User',
      avatar: 'https://via.placeholder.com/40'
    },
    isAuthenticated: true
  })
}));

// Mock router params
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '1'
  }),
  BrowserRouter: ({ children }) => <div>{children}</div>
}));

describe('IdeaDetails Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <IdeaDetails />
      </BrowserRouter>
    );
  });

  test('renders idea title and details', async () => {
    await waitFor(() => {
      expect(screen.getByText('Test Idea')).toBeInTheDocument();
      expect(screen.getByText('This is a test idea description')).toBeInTheDocument();
      expect(screen.getByText('This is a test problem statement')).toBeInTheDocument();
      expect(screen.getByText('This is a test solution')).toBeInTheDocument();
    });
  });

  test('renders creator information', async () => {
    await waitFor(() => {
      expect(screen.getByText('Creator User')).toBeInTheDocument();
      expect(screen.getByText('Level 5')).toBeInTheDocument();
    });
  });

  test('renders team members', async () => {
    await waitFor(() => {
      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(screen.getByText('Creator User')).toBeInTheDocument();
      expect(screen.getByText('Team Member 1')).toBeInTheDocument();
    });
  });

  test('renders tags', async () => {
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('innovation')).toBeInTheDocument();
      expect(screen.getByText('technology')).toBeInTheDocument();
    });
  });

  test('renders comments section', async () => {
    await waitFor(() => {
      expect(screen.getByText('Comments')).toBeInTheDocument();
      expect(screen.getByText('This is a great idea!')).toBeInTheDocument();
      expect(screen.getByText('I would suggest adding more details about implementation.')).toBeInTheDocument();
    });
  });

  test('allows adding a new comment', async () => {
    await waitFor(() => {
      const commentInput = screen.getByPlaceholderText(/Add a comment/i);
      expect(commentInput).toBeInTheDocument();
      
      fireEvent.change(commentInput, { target: { value: 'New test comment' } });
      fireEvent.click(screen.getByText(/Post/i));
    });
    
    // Wait for the comment to be added
    await waitFor(() => {
      expect(screen.getByText('New test comment')).toBeInTheDocument();
    });
  });

  test('allows liking the idea', async () => {
    await waitFor(() => {
      const likeButton = screen.getByLabelText(/Like/i);
      expect(likeButton).toBeInTheDocument();
      
      fireEvent.click(likeButton);
    });
    
    // Wait for the like count to update
    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument(); // 3 original likes + 1 new like
    });
  });

  test('shows ratings section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Ratings/i)).toBeInTheDocument();
      expect(screen.getByText(/Innovation/i)).toBeInTheDocument();
      expect(screen.getByText(/Feasibility/i)).toBeInTheDocument();
      expect(screen.getByText(/Market Potential/i)).toBeInTheDocument();
      expect(screen.getByText(/Impact/i)).toBeInTheDocument();
      expect(screen.getByText(/Overall/i)).toBeInTheDocument();
    });
  });
});
