import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../src/pages/Dashboard';

// Mock the API calls
jest.mock('../src/services/api', () => ({
  getTrendingIdeas: jest.fn().mockResolvedValue({
    data: [
      {
        id: '1',
        title: 'Test Idea 1',
        description: 'Test description 1',
        creator: { name: 'Test User 1', avatar: 'https://via.placeholder.com/40' },
        tags: ['test', 'idea'],
        likes: 10,
        comments: 5
      },
      {
        id: '2',
        title: 'Test Idea 2',
        description: 'Test description 2',
        creator: { name: 'Test User 2', avatar: 'https://via.placeholder.com/40' },
        tags: ['test', 'idea'],
        likes: 8,
        comments: 3
      }
    ]
  }),
  getActiveSpaces: jest.fn().mockResolvedValue({
    data: [
      {
        id: '1',
        title: 'Test Space 1',
        description: 'Test space description 1',
        host: { name: 'Test Host 1', avatar: 'https://via.placeholder.com/40' },
        participants: 5,
        status: 'Live'
      },
      {
        id: '2',
        title: 'Test Space 2',
        description: 'Test space description 2',
        host: { name: 'Test Host 2', avatar: 'https://via.placeholder.com/40' },
        participants: 3,
        status: 'Scheduled'
      }
    ]
  }),
  getRecommendedConnections: jest.fn().mockResolvedValue({
    data: [
      {
        id: '1',
        name: 'Test Connection 1',
        role: 'Developer',
        avatar: 'https://via.placeholder.com/40',
        skills: ['JavaScript', 'React']
      },
      {
        id: '2',
        name: 'Test Connection 2',
        role: 'Designer',
        avatar: 'https://via.placeholder.com/40',
        skills: ['UI/UX', 'Figma']
      }
    ]
  })
}));

// Mock the context
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      name: 'Test User',
      avatar: 'https://via.placeholder.com/40',
      level: 5,
      xp: 250,
      nextLevelXp: 500
    },
    isAuthenticated: true
  })
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  });

  test('renders dashboard title', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });
  });

  test('renders trending ideas section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Trending Ideas/i)).toBeInTheDocument();
      expect(screen.getByText('Test Idea 1')).toBeInTheDocument();
      expect(screen.getByText('Test Idea 2')).toBeInTheDocument();
    });
  });

  test('renders active spaces section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Active Spaces/i)).toBeInTheDocument();
      expect(screen.getByText('Test Space 1')).toBeInTheDocument();
      expect(screen.getByText('Test Space 2')).toBeInTheDocument();
    });
  });

  test('renders recommended connections section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Recommended Connections/i)).toBeInTheDocument();
      expect(screen.getByText('Test Connection 1')).toBeInTheDocument();
      expect(screen.getByText('Test Connection 2')).toBeInTheDocument();
    });
  });

  test('renders user progress section', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Your Progress/i)).toBeInTheDocument();
      expect(screen.getByText(/Level 5/i)).toBeInTheDocument();
      expect(screen.getByText(/250 \/ 500 XP/i)).toBeInTheDocument();
    });
  });
});
