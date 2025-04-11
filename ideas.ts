import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Routes will be implemented in step 005
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ideas API is working'
  });
});

export default router;
