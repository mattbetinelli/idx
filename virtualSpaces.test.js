import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/index.js';
import VirtualSpace from '../src/models/VirtualSpace.js';
import User from '../src/models/User.js';

let mongoServer;
let token;
let userId;
let spaceId;

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

describe('Virtual Spaces API', () => {
  beforeEach(async () => {
    await VirtualSpace.deleteMany({});
    
    // Create a test virtual space
    const space = await VirtualSpace.create({
      title: 'Test Virtual Space',
      description: 'This is a test virtual space',
      host: userId,
      participants: [
        {
          user: userId,
          role: 'Host',
          status: 'Online'
        }
      ],
      schedule: {
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: 60
      },
      tags: ['test', 'virtual']
    });
    
    spaceId = space._id;
  });

  describe('GET /api/virtual-spaces', () => {
    it('should get all virtual spaces', async () => {
      const res = await request(app)
        .get('/api/virtual-spaces');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toEqual(1);
    });
  });

  describe('GET /api/virtual-spaces/:id', () => {
    it('should get a single virtual space by ID', async () => {
      const res = await request(app)
        .get(`/api/virtual-spaces/${spaceId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'Test Virtual Space');
      expect(res.body.data).toHaveProperty('description', 'This is a test virtual space');
    });

    it('should return 404 for non-existent virtual space ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/virtual-spaces/${fakeId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/virtual-spaces', () => {
    it('should create a new virtual space with valid token', async () => {
      const res = await request(app)
        .post('/api/virtual-spaces')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Test Virtual Space',
          description: 'This is a new test virtual space',
          schedule: {
            startTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
            duration: 90
          },
          tags: ['new', 'test']
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'New Test Virtual Space');
      expect(res.body.data).toHaveProperty('host', userId.toString());
      expect(res.body.data.participants[0]).toHaveProperty('user', userId.toString());
      expect(res.body.data.participants[0]).toHaveProperty('role', 'Host');
    });

    it('should not create a virtual space without token', async () => {
      const res = await request(app)
        .post('/api/virtual-spaces')
        .send({
          title: 'New Test Virtual Space',
          description: 'This is a new test virtual space',
          schedule: {
            startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
            duration: 90
          }
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not create a virtual space with invalid data', async () => {
      const res = await request(app)
        .post('/api/virtual-spaces')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
          description: 'This is a new test virtual space'
          // Missing required fields
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/virtual-spaces/:id/join', () => {
    let secondUserId;
    let secondUserToken;

    beforeEach(async () => {
      // Create a second test user
      const secondUser = await User.create({
        name: 'Second User',
        email: 'second@example.com',
        password: 'password123'
      });

      secondUserId = secondUser._id;
      secondUserToken = secondUser.getSignedJwtToken();
    });

    it('should allow a user to join a virtual space', async () => {
      const res = await request(app)
        .put(`/api/virtual-spaces/${spaceId}/join`)
        .set('Authorization', `Bearer ${secondUserToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      
      // Check that the user was added to participants
      const participants = res.body.data.participants;
      const joined = participants.some(p => p.user.toString() === secondUserId.toString());
      expect(joined).toBeTruthy();
    });

    it('should not allow joining without token', async () => {
      const res = await request(app)
        .put(`/api/virtual-spaces/${spaceId}/join`);
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/virtual-spaces/:id/messages', () => {
    it('should add a message to a virtual space with valid token', async () => {
      const res = await request(app)
        .post(`/api/virtual-spaces/${spaceId}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'This is a test message'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0]).toHaveProperty('text', 'This is a test message');
      expect(res.body.data[0]).toHaveProperty('user', userId.toString());
    });

    it('should not add a message without token', async () => {
      const res = await request(app)
        .post(`/api/virtual-spaces/${spaceId}/messages`)
        .send({
          text: 'This is a test message'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should not add a message with empty text', async () => {
      const res = await request(app)
        .post(`/api/virtual-spaces/${spaceId}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: ''
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});
