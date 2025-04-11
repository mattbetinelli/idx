import Achievement from '../models/Achievement.js';
import Badge from '../models/Badge.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Get all achievements
// @route   GET /api/gamification/achievements
// @access  Public
export const getAchievements = asyncHandler(async (req, res, next) => {
  const achievements = await Achievement.find({ isHidden: false });

  res.status(200).json({
    success: true,
    count: achievements.length,
    data: achievements
  });
});

// @desc    Create new achievement
// @route   POST /api/gamification/achievements
// @access  Private/Admin
export const createAchievement = asyncHandler(async (req, res, next) => {
  const achievement = await Achievement.create(req.body);

  res.status(201).json({
    success: true,
    data: achievement
  });
});

// @desc    Get all badges
// @route   GET /api/gamification/badges
// @access  Public
export const getBadges = asyncHandler(async (req, res, next) => {
  const badges = await Badge.find({ isDisplayable: true });

  res.status(200).json({
    success: true,
    count: badges.length,
    data: badges
  });
});

// @desc    Create new badge
// @route   POST /api/gamification/badges
// @access  Private/Admin
export const createBadge = asyncHandler(async (req, res, next) => {
  const badge = await Badge.create(req.body);

  res.status(201).json({
    success: true,
    data: badge
  });
});

// @desc    Award achievement to user
// @route   POST /api/gamification/users/:userId/achievements/:achievementId
// @access  Private/Admin
export const awardAchievement = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const achievement = await Achievement.findById(req.params.achievementId);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    );
  }

  if (!achievement) {
    return next(
      new ErrorResponse(`Achievement not found with id of ${req.params.achievementId}`, 404)
    );
  }

  // Check if user already has this achievement
  const hasAchievement = user.achievements.some(
    a => a.title === achievement.name
  );

  if (hasAchievement) {
    return next(
      new ErrorResponse(`User already has this achievement`, 400)
    );
  }

  // Add achievement to user
  user.achievements.push({
    title: achievement.name,
    description: achievement.description,
    icon: achievement.icon,
    dateEarned: Date.now()
  });

  // Award XP if applicable
  if (achievement.xpReward > 0) {
    await user.addXp(achievement.xpReward);
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.achievements
  });
});

// @desc    Award badge to user
// @route   POST /api/gamification/users/:userId/badges/:badgeId
// @access  Private/Admin
export const awardBadge = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const badge = await Badge.findById(req.params.badgeId);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    );
  }

  if (!badge) {
    return next(
      new ErrorResponse(`Badge not found with id of ${req.params.badgeId}`, 404)
    );
  }

  // Check if user already has this badge
  if (!user.badges) {
    user.badges = [];
  }

  const hasBadge = user.badges.some(
    b => b.name === badge.name && b.level >= badge.level
  );

  if (hasBadge) {
    return next(
      new ErrorResponse(`User already has this badge at the same or higher level`, 400)
    );
  }

  // Add or update badge
  const existingBadgeIndex = user.badges.findIndex(
    b => b.name === badge.name
  );

  if (existingBadgeIndex !== -1) {
    // Update existing badge if new one is higher level
    if (badge.level > user.badges[existingBadgeIndex].level) {
      user.badges[existingBadgeIndex] = {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        level: badge.level,
        category: badge.category,
        dateEarned: Date.now()
      };
    }
  } else {
    // Add new badge
    user.badges.push({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      level: badge.level,
      category: badge.category,
      dateEarned: Date.now()
    });
  }

  // Award XP based on badge level
  const xpReward = badge.level * 25;
  await user.addXp(xpReward);

  await user.save();

  res.status(200).json({
    success: true,
    data: user.badges
  });
});

// @desc    Check user achievements
// @route   GET /api/gamification/users/:userId/check-achievements
// @access  Private
export const checkAchievements = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId)
    .populate('ideas')
    .populate({
      path: 'connections',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    );
  }

  // Make sure user is checking their own achievements or is admin
  if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to check achievements for this user`, 401)
    );
  }

  // Get all achievements
  const achievements = await Achievement.find({});
  
  // Track newly earned achievements
  const newlyEarned = [];

  // Check each achievement
  for (const achievement of achievements) {
    // Skip if user already has this achievement
    const hasAchievement = user.achievements.some(
      a => a.title === achievement.name
    );
    
    if (hasAchievement) continue;

    // Check requirements based on achievement category
    let requirementsMet = false;

    switch (achievement.category) {
      case 'Participation':
        // Example: Check login streak, comments made, etc.
        if (achievement.requirements.type === 'comments' && 
            user.comments && user.comments.length >= achievement.requirements.count) {
          requirementsMet = true;
        }
        break;
        
      case 'Creation':
        // Example: Check ideas created
        if (achievement.requirements.type === 'ideas' && 
            user.ideas && user.ideas.length >= achievement.requirements.count) {
          requirementsMet = true;
        }
        break;
        
      case 'Collaboration':
        // Example: Check team memberships, connections
        if (achievement.requirements.type === 'connections' && 
            user.connections && 
            user.connections.filter(c => c.status === 'accepted').length >= achievement.requirements.count) {
          requirementsMet = true;
        }
        break;
        
      case 'Recognition':
        // Example: Check likes received, ratings
        if (achievement.requirements.type === 'likes' && 
            user.likesReceived && user.likesReceived >= achievement.requirements.count) {
          requirementsMet = true;
        }
        break;
        
      case 'Milestone':
        // Example: Check level reached, XP earned
        if (achievement.requirements.type === 'level' && 
            user.level >= achievement.requirements.level) {
          requirementsMet = true;
        } else if (achievement.requirements.type === 'xp' && 
                  user.xp >= achievement.requirements.xp) {
          requirementsMet = true;
        }
        break;
    }

    // Award achievement if requirements are met
    if (requirementsMet) {
      user.achievements.push({
        title: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        dateEarned: Date.now()
      });

      // Award XP if applicable
      if (achievement.xpReward > 0) {
        await user.addXp(achievement.xpReward);
      }

      newlyEarned.push(achievement);
    }
  }

  if (newlyEarned.length > 0) {
    await user.save();
  }

  res.status(200).json({
    success: true,
    data: {
      allAchievements: user.achievements,
      newlyEarned
    }
  });
});

// @desc    Get user leaderboard position
// @route   GET /api/gamification/leaderboards/:category/users/:userId
// @access  Private
export const getUserLeaderboardPosition = asyncHandler(async (req, res, next) => {
  const { category, userId } = req.params;
  const { timeframe = 'Weekly' } = req.query;

  const user = await User.findById(userId);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${userId}`, 404)
    );
  }

  // Find the appropriate leaderboard
  const leaderboard = await Leaderboard.findOne({
    category,
    timeframe
  }).populate({
    path: 'entries.user',
    select: 'name avatar level'
  });

  if (!leaderboard) {
    return next(
      new ErrorResponse(`Leaderboard not found for category ${category} and timeframe ${timeframe}`, 404)
    );
  }

  // Find user's position
  const userEntry = leaderboard.entries.find(
    entry => entry.user._id.toString() === userId
  );

  // Get top 10 entries
  const topEntries = leaderboard.entries.slice(0, 10);

  res.status(200).json({
    success: true,
    data: {
      leaderboard: {
        name: leaderboard.name,
        description: leaderboard.description,
        category: leaderboard.category,
        timeframe: leaderboard.timeframe,
        lastUpdated: leaderboard.lastUpdated
      },
      userPosition: userEntry ? userEntry.rank : null,
      userScore: userEntry ? userEntry.score : null,
      previousRank: userEntry ? userEntry.previousRank : null,
      topEntries
    }
  });
});
