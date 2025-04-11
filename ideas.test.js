import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/index.js';
import Idea from '../src/models/Idea.js';
import User from '../src/models/User.js';

let mongoServer;
let token;
let userId;
let ideaId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a test user and get token
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  userId = user._id;
  token = user.getSignedJwtToken();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Ideas API', () => {
  beforeEach(async () => {
    await Idea.deleteMany({});
    
    // Create a test idea
    const idea = await Idea.create({
      title: 'Test Idea',
      description: 'This is a test idea',
      problemStatement: 'This is a test problem',
      solution: 'This is a test solution',
      creator: userId,
      tags: ['test', 'idea']
    });
    
    ideaId = idea._id;
  });

  describe('GET /api/ideas', () => {
    it('should get all ideas', async () => {
      const res = await request(app)
        .get('/api/ideas');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toEqual(1);
    });
  });

  describe('GET /api/ideas/:id', () => {
    it('should get a single idea by ID', async () => {
      const res = await request(app)
        .get(`/api/ideas/${ideaId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'Test Idea');
      expect(res.body.data).toHaveProperty('description', 'This is a test idea');
    });

    it('should return 404 for non-existent idea ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/ideas/${fakeId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/ideas', () => {
    it('should create a new idea with valid token', async () => {
      const res = await request(app)
        .post('/api/ideas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Test Idea',
          description: 'This is a new test idea',
          problemStatement: 'This is a new test problem',
          solution: 'This is a new test solution',
          tags: ['new', 'test']
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'New Test Idea');
      expect(res.body.data).toHaveProperty('creator', userId.toString());
    });

    it('should not create an idea without token', async () => {
      const res = await request(app)
        .post('/api/ideas')
        .send({
          title: 'New Test Idea',
          description: 'This is a new test idea',
          problemStatement: 'This is a new test problem',
          solution: 'This is a new test solution'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not create an idea with invalid data', async () => {
      const res = await request(app)
        .post('/api/ideas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
          description: 'This is a new test idea'
          // Missing required fields
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/ideas/:id', () => {
    it('should update an idea with valid token and ownership', async () => {
      const res = await request(app)
        .put(`/api/ideas/${ideaId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Test Idea',
          description: 'This is an updated test idea'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'Updated Test Idea');
      expect(res.body.data).toHaveProperty('description', 'This is an updated test idea');
    });

    it('should not update an idea without token', async () => {
      const res = await request(app)
        .put(`/api/ideas/${ideaId}`)
        .send({
          title: 'Updated Test Idea'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not update an idea with invalid ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/ideas/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Test Idea'
        });
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/ideas/:id/comments', () => {
    it('should add a comment to an idea with valid token', async () => {
      const res = await request(app)
        .post(`/api/ideas/${ideaId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'This is a test comment'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0]).toHaveProperty('text', 'This is a test comment');
      expect(res.body.data[0]).toHaveProperty('user', userId.toString());
    });

    it('should not add a comment without token', async () => {
      const res = await request(app)
        .post(`/api/ideas/${ideaId}/comments`)
        .send({
          text: 'This is a test comment'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not add a comment with empty text', async () => {
      const res = await request(app)
        .post(`/api/ideas/${ideaId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: ''
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/ideas/:id/like', () => {
    it('should like an idea with valid token', async () => {
      const res = await request(app)
        .put(`/api/ideas/${ideaId}/like`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toContain(userId.toString());
    });

    it('should unlike an idea that was previously liked', async () => {
      // First like the idea
      await request(app)
        .put(`/api/ideas/${ideaId}/like`)
        .set('Authorization', `Bearer ${token}`);
      
      // Then unlike it
      const res = await request(app)
        .put(`/api/ideas/${ideaId}/like`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).not.toContain(userId.toString());
    });

    it('should not like an idea without token', async () => {
      const res = await request(app)
        .put(`/api/ideas/${ideaId}/like`);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});
