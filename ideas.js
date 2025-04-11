import Idea from '../models/Idea.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Create new idea
// @route   POST /api/ideas
// @access  Private
export const createIdea = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.creator = req.user.id;

  const idea = await Idea.create(req.body);

  // Add idea to user's ideas array
  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { ideas: idea._id } },
    { new: true }
  );

  // Award XP for creating an idea
  const user = await User.findById(req.user.id);
  await user.addXp(50);

  res.status(201).json({
    success: true,
    data: idea
  });
});

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Public
export const getIdeas = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single idea
// @route   GET /api/ideas/:id
// @access  Public
export const getIdea = asyncHandler(async (req, res, next) => {
  const idea = await Idea.findById(req.params.id)
    .populate({
      path: 'creator',
      select: 'name avatar role level bio'
    })
    .populate({
      path: 'team.user',
      select: 'name avatar role level'
    })
    .populate({
      path: 'comments.user',
      select: 'name avatar role level'
    });

  if (!idea) {
    return next(
      new ErrorResponse(`Idea not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment view count
  idea.views += 1;
  await idea.save();

  res.status(200).json({
    success: true,
    data: idea
  });
});

// @desc    Update idea
// @route   PUT /api/ideas/:id
// @access  Private
export const updateIdea = asyncHandler(async (req, res, next) => {
  let idea = await Idea.findById(req.params.id);

  if (!idea) {
    return next(
      new ErrorResponse(`Idea not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is idea creator or admin
  if (idea.creator.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this idea`,
        401
      )
    );
  }

  idea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: idea
  });
});

// @desc    Delete idea
// @route   DELETE /api/ideas/:id
// @access  Private
export const deleteIdea = asyncHandler(async (req, res, next) => {
  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    return next(
      new ErrorResponse(`Idea not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is idea creator or admin
  if (idea.creator.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this idea`,
        401
      )
    );
  }

  // Remove idea from user's ideas array
  await User.findByIdAndUpdate(
    idea.creator,
    { $pull: { ideas: idea._id } },
    { new: true }
  );

  await idea.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like/unlike idea
// @route   PUT /api/ideas/:id/like
// @access  Private
export const likeIdea = asyncHandler(async (req, res, next) => {
  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    return next(
      new ErrorResponse(`Idea not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if idea has already been liked by user
  const alreadyLiked = idea.likes.some(
    like => like.toString() === req.user.id
  );

  if (alreadyLiked) {
    // Unlike
    idea.likes = idea.likes.filter(
      like => like.toString() !== req.user.id
    );
  } else {
    // Like
    idea.likes.push(req.user.id);

    // Award XP to idea creator if they're not the one liking
    if (idea.creator.toString() !== req.user.id) {
      const creator = await User.findById(idea.creator);
      await creator.addXp(5);
    }
  }

  await idea.save();

  res.status(200).json({
    success: true,
    data: idea.likes
  });
});

// @desc    Add comment to idea
// @route   POST /api/ideas/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res, next) => {
  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    return next(
      new ErrorResponse(`Idea not found with id of ${req.params.id}`, 404)
    );
  }

  const comment = {
    text: req.body.text,
    user: req.user.id
  };

  idea.comments.push(comment);

  await idea.save();

  // Award XP to commenter
  const user = await User.findById(req.user.id);
  await user.addXp(10);

  // Award XP to idea creator if they're not the one commenting
  if (idea.creator.toString() !== req.user.id) {
    const creator = await User.findById(idea.creator);
    await creator.addXp(3);
  }

  res.status(201).json({
    success: true,
    data: idea.comments
  });
});

// @desc    Rate idea
// @route   POST /api/ideas/:id/rate
// @access  Private
export const rateIdea = asyncHandler(async (req, res, next) => {
  const { innovation, feasibility, marketPotential, impact, overall } = req.body;

  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    return next(
      new ErrorResponse(`Idea not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user has already rated
  const ratingIndex = idea.ratings.findIndex(
    rating => rating.user.toString() === req.user.id
  );

  const rating = {
    user: req.user.id,
    innovation,
    feasibility,
    marketPotential,
    impact,
    overall
  };

  if (ratingIndex === -1) {
    // Add new rating
    idea.ratings.push(rating);
  } else {
    // Update existing rating
    idea.ratings[ratingIndex] = rating;
  }

  // Recalculate average ratings
  idea.calculateAverageRatings();
  await idea.save();

  // Award XP to rater
  const user = await User.findById(req.user.id);
  await user.addXp(15);

  // Award XP to idea creator if they're not the one rating
  if (idea.creator.toString() !== req.user.id) {
    const creator = await User.findById(idea.creator);
    await creator.addXp(5);
  }

  res.status(200).json({
    success: true,
    data: idea.averageRatings
  });
});

// @desc    Join idea team
// @route   PUT /api/ideas/:id/join
// @access  Private
export const joinTeam = asyncHandler(async (req, res, next) => {
  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    return next(
      new ErrorResponse(`Idea not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is already in team
  const alreadyInTeam = idea.team.some(
    member => member.user.toString() === req.user.id
  );

  if (alreadyInTeam) {
    return next(
      new ErrorResponse(`User is already in the team`, 400)
    );
  }

  // Add user to team
  idea.team.push({
    user: req.user.id,
    role: req.body.role || 'Member',
    status: 'Pending'
  });

  await idea.save();

  // Award XP to user for joining team
  const user = await User.findById(req.user.id);
  await user.addXp(20);

  res.status(200).json({
    success: true,
    data: idea.team
  });
});

// @desc    Update team member status
// @route   PUT /api/ideas/:id/team/:userId
// @access  Private
export const updateTeamMember = asyncHandler(async (req, res, next) => {
  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    return next(
      new ErrorResponse(`Idea not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is idea creator or admin
  if (idea.creator.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update team members`,
        401
      )
    );
  }

  // Find team member
  const memberIndex = idea.team.findIndex(
    member => member.user.toString() === req.params.userId
  );

  if (memberIndex === -1) {
    return next(
      new ErrorResponse(`User is not in the team`, 404)
    );
  }

  // Update team member
  idea.team[memberIndex].status = req.body.status;
  if (req.body.role) {
    idea.team[memberIndex].role = req.body.role;
  }

  await idea.save();

  // If status is accepted, award XP to team member
  if (req.body.status === 'Accepted') {
    const teamMember = await User.findById(req.params.userId);
    await teamMember.addXp(30);
  }

  res.status(200).json({
    success: true,
    data: idea.team
  });
});

// @desc    Add update to idea
// @route   POST /api/ideas/:id/updates
// @access  Private
export const addUpdate = asyncHandler(async (req, res, next) => {
  const idea = await Idea.findById(req.params.id);

  if (!idea) {
    return next(
      new ErrorResponse(`Idea not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is idea creator or team member
  const isTeamMember = idea.team.some(
    member => 
      member.user.toString() === req.user.id && 
      member.status === 'Accepted'
  );

  if (idea.creator.toString() !== req.user.id && !isTeamMember && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add updates to this idea`,
        401
      )
    );
  }

  const update = {
    title: req.body.title,
    content: req.body.content,
    author: req.user.id
  };

  idea.updates.push(update);
  await idea.save();

  // Award XP to user for adding update
  const user = await User.findById(req.user.id);
  await user.addXp(25);

  res.status(201).json({
    success: true,
    data: idea.updates
  });
});
