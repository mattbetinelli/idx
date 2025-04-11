import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/index.js';
import Achievement from '../src/models/Achievement.js';
import Badge from '../src/models/Badge.js';
import User from '../src/models/User.js';

let mongoServer;
let token;
let adminToken;
let userId;
let adminId;
let achievementId;
let badgeId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a regular test user
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  userId = user._id;
  token = user.getSignedJwtToken();

  // Create an admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });

  adminId = admin._id;
  adminToken = admin.getSignedJwtToken();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Gamification API', () => {
  beforeEach(async () => {
    await Achievement.deleteMany({});
    await Badge.deleteMany({});
    
    // Create a test achievement
    const achievement = await Achievement.create({
      name: 'Test Achievement',
      description: 'This is a test achievement',
      category: 'Participation',
      requirements: {
        type: 'comments',
        count: 5
      },
      xpReward: 50
    });
    
    achievementId = achievement._id;

    // Create a test badge
    const badge = await Badge.create({
      name: 'Test Badge',
      description: 'This is a test badge',
      icon: 'star',
      category: 'Skill',
      level: 1,
      requirements: {
        type: 'skill',
        level: 3
      }
    });
    
    badgeId = badge._id;
  });

  describe('GET /api/gamification/achievements', () => {
    it('should get all achievements', async () => {
      const res = await request(app)
        .get('/api/gamification/achievements');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toEqual(1);
      expect(res.body.data[0]).toHaveProperty('name', 'Test Achievement');
    });
  });

  describe('GET /api/gamification/badges', () => {
    it('should get all badges', async () => {
      const res = await request(app)
        .get('/api/gamification/badges');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toEqual(1);
      expect(res.body.data[0]).toHaveProperty('name', 'Test Badge');
    });
  });

  describe('POST /api/gamification/achievements', () => {
    it('should create a new achievement with admin token', async () => {
      const res = await request(app)
        .post('/api/gamification/achievements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Achievement',
          description: 'This is a new achievement',
          category: 'Creation',
          requirements: {
            type: 'ideas',
            count: 3
          },
          xpReward: 75
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('name', 'New Achievement');
      expect(res.body.data).toHaveProperty('category', 'Creation');
    });

    it('should not create an achievement with regular user token', async () => {
      const res = await request(app)
        .post('/api/gamification/achievements')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Achievement',
          description: 'This is a new achievement',
          category: 'Creation',
          requirements: {
            type: 'ideas',
            count: 3
          },
          xpReward: 75
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/gamification/badges', () => {
    it('should create a new badge with admin token', async () => {
      const res = await request(app)
        .post('/api/gamification/badges')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Badge',
          description: 'This is a new badge',
          icon: 'trophy',
          category: 'Community',
          level: 2,
          requirements: {
            type: 'connections',
            count: 10
          }
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('name', 'New Badge');
      expect(res.body.data).toHaveProperty('category', 'Community');
      expect(res.body.data).toHaveProperty('level', 2);
    });

    it('should not create a badge with regular user token', async () => {
      const res = await request(app)
        .post('/api/gamification/badges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Badge',
          description: 'This is a new badge',
          icon: 'trophy',
          category: 'Community',
          level: 2,
          requirements: {
            type: 'connections',
            count: 10
          }
        });
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/gamification/users/:userId/achievements/:achievementId', () => {
    it('should award an achievement to a user with admin token', async () => {
      const res = await request(app)
        .post(`/api/gamification/users/${userId}/achievements/${achievementId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0]).toHaveProperty('title', 'Test Achievement');
    });

    it('should not award an achievement with regular user token', async () => {
      const res = await request(app)
        .post(`/api/gamification/users/${userId}/achievements/${achievementId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/gamification/users/:userId/badges/:badgeId', () => {
    it('should award a badge to a user with admin token', async () => {
      const res = await request(app)
        .post(`/api/gamification/users/${userId}/badges/${badgeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0]).toHaveProperty('name', 'Test Badge');
    });

    it('should not award a badge with regular user token', async () => {
      const res = await request(app)
        .post(`/api/gamification/users/${userId}/badges/${badgeId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/gamification/users/:userId/check-achievements', () => {
    it('should check achievements for the authenticated user', async () => {
      const res = await request(app)
        .get(`/api/gamification/users/${userId}/check-achievements`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('allAchievements');
      expect(res.body.data).toHaveProperty('newlyEarned');
    });

    it('should not check achievements for another user', async () => {
      // Create another user
      const anotherUser = await User.create({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123'
      });

      const res = await request(app)
        .get(`/api/gamification/users/${anotherUser._id}/check-achievements`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should allow admin to check achievements for any user', async () => {
      const res = await request(app)
        .get(`/api/gamification/users/${userId}/check-achievements`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });
});
