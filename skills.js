import SkillProgression from '../models/SkillProgression.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Get user skills
// @route   GET /api/skills/users/:userId
// @access  Private
export const getUserSkills = asyncHandler(async (req, res, next) => {
  const skills = await SkillProgression.find({ user: req.params.userId })
    .populate({
      path: 'endorsements.user',
      select: 'name avatar level'
    });

  res.status(200).json({
    success: true,
    count: skills.length,
    data: skills
  });
});

// @desc    Add or update user skill
// @route   POST /api/skills/users/:userId
// @access  Private
export const addUserSkill = asyncHandler(async (req, res, next) => {
  const { skill, category } = req.body;

  // Check if user exists
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    );
  }

  // Make sure user is adding their own skill or is admin
  if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to add skills for this user`, 401)
    );
  }

  // Check if skill already exists for user
  let skillProgression = await SkillProgression.findOne({
    user: req.params.userId,
    skill
  });

  if (skillProgression) {
    // Update existing skill
    skillProgression.category = category || skillProgression.category;
    skillProgression.lastUsed = Date.now();
    skillProgression.updatedAt = Date.now();
    
    await skillProgression.save();
  } else {
    // Create new skill
    skillProgression = await SkillProgression.create({
      user: req.params.userId,
      skill,
      category
    });

    // Award XP for adding a new skill
    await user.addXp(15);
  }

  res.status(200).json({
    success: true,
    data: skillProgression
  });
});

// @desc    Add experience to user skill
// @route   PUT /api/skills/:skillId/experience
// @access  Private
export const addSkillExperience = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return next(
      new ErrorResponse('Please provide a valid experience amount', 400)
    );
  }

  const skillProgression = await SkillProgression.findById(req.params.skillId);

  if (!skillProgression) {
    return next(
      new ErrorResponse(`Skill not found with id of ${req.params.skillId}`, 404)
    );
  }

  // Make sure user is adding to their own skill or is admin
  if (skillProgression.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to add experience to this skill`, 401)
    );
  }

  // Add experience
  await skillProgression.addExperience(amount);

  // If skill leveled up, award XP to user
  const user = await User.findById(skillProgression.user);
  if (skillProgression.experience === 0) {
    // This means a level up just occurred
    await user.addXp(skillProgression.level * 20);
  }

  res.status(200).json({
    success: true,
    data: skillProgression
  });
});

// @desc    Endorse user skill
// @route   POST /api/skills/:skillId/endorse
// @access  Private
export const endorseSkill = asyncHandler(async (req, res, next) => {
  const { strength } = req.body;

  if (!strength || strength < 1 || strength > 5) {
    return next(
      new ErrorResponse('Please provide a valid endorsement strength (1-5)', 400)
    );
  }

  const skillProgression = await SkillProgression.findById(req.params.skillId);

  if (!skillProgression) {
    return next(
      new ErrorResponse(`Skill not found with id of ${req.params.skillId}`, 404)
    );
  }

  // Users cannot endorse their own skills
  if (skillProgression.user.toString() === req.user.id) {
    return next(
      new ErrorResponse('You cannot endorse your own skills', 400)
    );
  }

  // Add endorsement
  await skillProgression.addEndorsement(req.user.id, strength);

  // Award XP to both users
  const skillOwner = await User.findById(skillProgression.user);
  await skillOwner.addXp(strength * 5);

  const endorser = await User.findById(req.user.id);
  await endorser.addXp(3);

  res.status(200).json({
    success: true,
    data: skillProgression
  });
});

// @desc    Get skill recommendations
// @route   GET /api/skills/recommendations
// @access  Private
export const getSkillRecommendations = asyncHandler(async (req, res, next) => {
  // Get user's current skills
  const userSkills = await SkillProgression.find({ user: req.user.id });
  
  // Get user's interests from profile
  const user = await User.findById(req.user.id);
  
  // Extract skill names and categories
  const skillNames = userSkills.map(s => s.skill);
  const skillCategories = [...new Set(userSkills.map(s => s.category))];
  
  // Find popular skills in the same categories that user doesn't have
  const popularSkills = await SkillProgression.aggregate([
    {
      $match: {
        skill: { $nin: skillNames },
        category: { $in: skillCategories }
      }
    },
    {
      $group: {
        _id: '$skill',
        category: { $first: '$category' },
        count: { $sum: 1 },
        avgLevel: { $avg: '$level' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  // Find skills related to user's interests
  const interestRelatedSkills = [];
  if (user.interests && user.interests.length > 0) {
    // Create regex to match any interest
    const interestRegex = new RegExp(user.interests.join('|'), 'i');
    
    const relatedSkills = await SkillProgression.aggregate([
      {
        $match: {
          skill: { 
            $nin: skillNames,
            $regex: interestRegex
          }
        }
      },
      {
        $group: {
          _id: '$skill',
          category: { $first: '$category' },
          count: { $sum: 1 },
          avgLevel: { $avg: '$level' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    interestRelatedSkills.push(...relatedSkills);
  }
  
  res.status(200).json({
    success: true,
    data: {
      popularSkills,
      interestRelatedSkills
    }
  });
});
