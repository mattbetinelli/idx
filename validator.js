import { validationResult } from 'express-validator';
import ErrorResponse from '../utils/errorResponse.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Extract the first error message
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 400));
  }
  next();
};

export default validateRequest;
