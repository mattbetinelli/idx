# IdeaXchange Deployment Guide

This document provides instructions for deploying the IdeaXchange platform to a production environment.

## Prerequisites

- Node.js 16+ and npm
- MongoDB database
- Domain name (optional for production deployment)
- SSL certificate (recommended for production)

## Backend Deployment

### Environment Setup

1. Create a production `.env` file in the backend directory:

```
NODE_ENV=production
PORT=5000
MONGO_URI=<your_production_mongodb_uri>
JWT_SECRET=<strong_random_secret_key>
JWT_EXPIRE=30d
FRONTEND_URL=<your_frontend_url>
```

### Deployment Options

#### Option 1: Traditional Hosting (e.g., DigitalOcean, AWS EC2)

1. Set up a server with Node.js installed
2. Clone the repository to your server
3. Install dependencies: `cd backend && npm install --production`
4. Start the server: `npm start`
5. Use PM2 for process management: `pm2 start src/index.js --name ideaxchange-api`

#### Option 2: Containerized Deployment (Docker)

1. Build the Docker image: `docker build -t ideaxchange-api ./backend`
2. Run the container: `docker run -p 5000:5000 --env-file ./backend/.env -d ideaxchange-api`

#### Option 3: Serverless Deployment (e.g., AWS Lambda, Vercel)

1. Configure serverless deployment based on your provider's requirements
2. Deploy using provider-specific commands

## Frontend Deployment

### Build for Production

1. Update the API URL in the frontend configuration:
   - Edit `/frontend/src/config.js` to point to your production API URL

2. Build the production bundle:
   ```
   cd frontend
   npm install
   npm run build
   ```

### Deployment Options

#### Option 1: Static Hosting (e.g., Netlify, Vercel, AWS S3)

1. Deploy the build folder to your static hosting provider
2. Configure redirects for client-side routing

#### Option 2: Traditional Hosting

1. Copy the build folder to your web server
2. Configure your web server (Nginx, Apache) to serve the static files

## Database Setup

1. Set up a MongoDB database (MongoDB Atlas recommended for production)
2. Configure network access and database user credentials
3. Update the `MONGO_URI` in your backend `.env` file

## Domain and SSL Configuration

1. Configure your domain to point to your deployed frontend and backend
2. Set up SSL certificates (Let's Encrypt is a free option)
3. Configure CORS in the backend to allow your frontend domain

## Monitoring and Logging

1. Set up application monitoring (e.g., New Relic, Datadog)
2. Configure error tracking (e.g., Sentry)
3. Set up log management (e.g., ELK stack, Loggly)

## Maintenance

1. Set up automated backups for your database
2. Configure CI/CD pipelines for automated deployments
3. Implement a regular update schedule for dependencies

## Security Considerations

1. Regularly update dependencies to patch security vulnerabilities
2. Implement rate limiting and DDoS protection
3. Use a Web Application Firewall (WAF)
4. Regularly audit user permissions and access
