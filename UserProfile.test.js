import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserProfile from '../src/pages/UserProfile';

// Mock the API calls
jest.mock('../src/services/api', () => ({
  getUserProfile: jest.fn().mockResolvedValue({
    data: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://via.placeholder.com/150',
      bio: 'This is a test bio',
      role: 'Developer',
      level: 7,
      xp: 350,
      nextLevelXp: 500,
      skills: [
        { name: 'JavaScript', level: 4, endorsements: 8 },
        { name: 'React', level: 3, endorsements: 5 },
        { name: 'Node.js', level: 3, endorsements: 4 }
      ],
      interests: ['Web Development', 'AI', 'Mobile Apps'],
      achievements: [
        { title: 'First Idea', description: 'Created your first idea', dateEarned: '2025-03-15T12:00:00Z' },
        { title: 'Collaborator', description: 'Joined 5 virtual spaces', dateEarned: '2025-03-20T14:30:00Z' }
      ],
      badges: [
        { name: 'JavaScript Pro', level: 2, category: 'Skill', dateEarned: '2025-03-18T10:15:00Z' },
        { name: 'Team Player', level: 1, category: 'Community', dateEarned: '2025-03-22T16:45:00Z' }
      ],
      ideas: [
        { id: '101', title: 'Test Idea 1', likes: 12, comments: 5 },
        { id: '102', title: 'Test Idea 2', likes: 8, comments: 3 }
      ],
      connections: [
        { id: '201', name: 'Connection 1', avatar: 'https://via.placeholder.com/40', role: 'Designer' },
        { id: '202', name: 'Connection 2', avatar: 'https://via.placeholder.com/40', role: 'Product Manager' }
      ]
    }
  }),
  updateUserProfile: jest.fn().mockResolvedValue({
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

describe('UserProfile Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
  });

  test('renders user profile information', async () => {
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.getByText('This is a test bio')).toBeInTheDocument();
    });
  });

  test('renders user level and XP progress', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Level 7/i)).toBeInTheDocument();
      expect(screen.getByText(/350 \/ 500 XP/i)).toBeInTheDocument();
    });
  });

  test('renders user skills section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Skills/i)).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });
  });

  test('renders user achievements section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Achievements/i)).toBeInTheDocument();
      expect(screen.getByText('First Idea')).toBeInTheDocument();
      expect(screen.getByText('Collaborator')).toBeInTheDocument();
    });
  });

  test('renders user badges section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Badges/i)).toBeInTheDocument();
      expect(screen.getByText('JavaScript Pro')).toBeInTheDocument();
      expect(screen.getByText('Team Player')).toBeInTheDocument();
    });
  });

  test('renders user ideas section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/My Ideas/i)).toBeInTheDocument();
      expect(screen.getByText('Test Idea 1')).toBeInTheDocument();
      expect(screen.getByText('Test Idea 2')).toBeInTheDocument();
    });
  });

  test('renders user connections section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Connections/i)).toBeInTheDocument();
      expect(screen.getByText('Connection 1')).toBeInTheDocument();
      expect(screen.getByText('Connection 2')).toBeInTheDocument();
    });
  });

  test('edit profile button opens edit form', async () => {
    await waitFor(() => {
      const editButton = screen.getByText(/Edit Profile/i);
      expect(editButton).toBeInTheDocument();
      
      fireEvent.click(editButton);
      
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    });
  });
});
