import { check } from 'express-validator';

// User validation rules
export const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
];

export const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

export const updateUserValidation = [
  check('name', 'Name is required').optional().not().isEmpty(),
  check('email', 'Please include a valid email').optional().isEmail()
];

export const updatePasswordValidation = [
  check('currentPassword', 'Current password is required').exists(),
  check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
];

// Idea validation rules
export const createIdeaValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('problemStatement', 'Problem statement is required').not().isEmpty(),
  check('solution', 'Solution is required').not().isEmpty()
];

export const updateIdeaValidation = [
  check('title', 'Title is required').optional().not().isEmpty(),
  check('description', 'Description is required').optional().not().isEmpty(),
  check('problemStatement', 'Problem statement is required').optional().not().isEmpty(),
  check('solution', 'Solution is required').optional().not().isEmpty()
];

export const rateIdeaValidation = [
  check('innovation', 'Innovation rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('feasibility', 'Feasibility rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('marketPotential', 'Market potential rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('impact', 'Impact rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('overall', 'Overall rating must be between 1 and 5').isInt({ min: 1, max: 5 })
];

export const commentValidation = [
  check('text', 'Comment text is required').not().isEmpty()
];

// Virtual Space validation rules
export const createVirtualSpaceValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('schedule.startTime', 'Start time is required').not().isEmpty().isISO8601().toDate()
];

export const updateVirtualSpaceValidation = [
  check('title', 'Title is required').optional().not().isEmpty(),
  check('description', 'Description is required').optional().not().isEmpty(),
  check('schedule.startTime', 'Start time must be a valid date').optional().isISO8601().toDate()
];

export const messageValidation = [
  check('text', 'Message text is required').not().isEmpty()
];

// Skill validation rules
export const addSkillValidation = [
  check('skill', 'Skill name is required').not().isEmpty(),
  check('category', 'Category must be one of: Technical, Creative, Business, Soft, Other')
    .isIn(['Technical', 'Creative', 'Business', 'Soft', 'Other'])
];

export const endorseSkillValidation = [
  check('strength', 'Endorsement strength must be between 1 and 5').isInt({ min: 1, max: 5 })
];

// Gamification validation rules
export const createAchievementValidation = [
  check('name', 'Achievement name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('category', 'Category must be one of: Participation, Creation, Collaboration, Recognition, Milestone')
    .isIn(['Participation', 'Creation', 'Collaboration', 'Recognition', 'Milestone']),
  check('requirements', 'Requirements are required').not().isEmpty()
];

export const createBadgeValidation = [
  check('name', 'Badge name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('icon', 'Icon is required').not().isEmpty(),
  check('category', 'Category must be one of: Skill, Contribution, Community, Special')
    .isIn(['Skill', 'Contribution', 'Community', 'Special']),
  check('level', 'Level must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('requirements', 'Requirements are required').not().isEmpty()
];
