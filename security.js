import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

const securityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Sanitize data to prevent NoSQL injection
  app.use(mongoSanitize());

  // Prevent XSS attacks
  app.use(xss());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again after 10 minutes'
    }
  });
  app.use('/api/', limiter);

  // Prevent http param pollution
  app.use(hpp());

  // Enable CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));

  return app;
};

export default securityMiddleware;
