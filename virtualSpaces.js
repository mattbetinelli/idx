import VirtualSpace from '../models/VirtualSpace.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Create new virtual space
// @route   POST /api/virtual-spaces
// @access  Private
export const createVirtualSpace = asyncHandler(async (req, res, next) => {
  // Add user as host
  req.body.host = req.user.id;
  
  // Add host to participants
  if (!req.body.participants) {
    req.body.participants = [];
  }
  
  req.body.participants.push({
    user: req.user.id,
    role: 'Host',
    status: 'Online'
  });

  const virtualSpace = await VirtualSpace.create(req.body);

  // Award XP for creating a virtual space
  const user = await User.findById(req.user.id);
  await user.addXp(75);

  res.status(201).json({
    success: true,
    data: virtualSpace
  });
});

// @desc    Get all virtual spaces
// @route   GET /api/virtual-spaces
// @access  Public
export const getVirtualSpaces = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single virtual space
// @route   GET /api/virtual-spaces/:id
// @access  Public
export const getVirtualSpace = asyncHandler(async (req, res, next) => {
  const virtualSpace = await VirtualSpace.findById(req.params.id)
    .populate({
      path: 'host',
      select: 'name avatar role level bio'
    })
    .populate({
      path: 'participants.user',
      select: 'name avatar role level'
    })
    .populate({
      path: 'messages.user',
      select: 'name avatar role'
    })
    .populate({
      path: 'ideas',
      select: 'title description tags status likes comments'
    });

  if (!virtualSpace) {
    return next(
      new ErrorResponse(`Virtual space not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: virtualSpace
  });
});

// @desc    Update virtual space
// @route   PUT /api/virtual-spaces/:id
// @access  Private
export const updateVirtualSpace = asyncHandler(async (req, res, next) => {
  let virtualSpace = await VirtualSpace.findById(req.params.id);

  if (!virtualSpace) {
    return next(
      new ErrorResponse(`Virtual space not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is host or admin
  if (virtualSpace.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this virtual space`,
        401
      )
    );
  }

  virtualSpace = await VirtualSpace.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: virtualSpace
  });
});

// @desc    Delete virtual space
// @route   DELETE /api/virtual-spaces/:id
// @access  Private
export const deleteVirtualSpace = asyncHandler(async (req, res, next) => {
  const virtualSpace = await VirtualSpace.findById(req.params.id);

  if (!virtualSpace) {
    return next(
      new ErrorResponse(`Virtual space not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is host or admin
  if (virtualSpace.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this virtual space`,
        401
      )
    );
  }

  await virtualSpace.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Join virtual space
// @route   PUT /api/virtual-spaces/:id/join
// @access  Private
export const joinVirtualSpace = asyncHandler(async (req, res, next) => {
  const virtualSpace = await VirtualSpace.findById(req.params.id);

  if (!virtualSpace) {
    return next(
      new ErrorResponse(`Virtual space not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if space is at capacity
  if (virtualSpace.isAtCapacity()) {
    return next(
      new ErrorResponse(`Virtual space is at capacity`, 400)
    );
  }

  // Check if space requires host approval
  if (virtualSpace.settings.requireHostApproval && 
      virtualSpace.host.toString() !== req.user.id && 
      req.user.role !== 'admin') {
    
    // Add participant with pending status
    const existingParticipant = virtualSpace.participants.find(
      p => p.user.toString() === req.user.id
    );
    
    if (!existingParticipant) {
      virtualSpace.participants.push({
        user: req.user.id,
        role: 'Participant',
        status: 'Offline',
        joinedAt: Date.now()
      });
      
      await virtualSpace.save();
    }
    
    return res.status(200).json({
      success: true,
      data: {
        message: 'Join request sent, waiting for host approval'
      }
    });
  }

  // Add participant
  await virtualSpace.addParticipant(req.user.id);

  // Award XP for joining a virtual space
  const user = await User.findById(req.user.id);
  await user.addXp(15);

  res.status(200).json({
    success: true,
    data: virtualSpace
  });
});

// @desc    Leave virtual space
// @route   PUT /api/virtual-spaces/:id/leave
// @access  Private
export const leaveVirtualSpace = asyncHandler(async (req, res, next) => {
  const virtualSpace = await VirtualSpace.findById(req.params.id);

  if (!virtualSpace) {
    return next(
      new ErrorResponse(`Virtual space not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is host
  if (virtualSpace.host.toString() === req.user.id) {
    return next(
      new ErrorResponse(`Host cannot leave the virtual space, transfer host role first or delete the space`, 400)
    );
  }

  // Remove participant
  await virtualSpace.removeParticipant(req.user.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add message to virtual space chat
// @route   POST /api/virtual-spaces/:id/messages
// @access  Private
export const addMessage = asyncHandler(async (req, res, next) => {
  const virtualSpace = await VirtualSpace.findById(req.params.id);

  if (!virtualSpace) {
    return next(
      new ErrorResponse(`Virtual space not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is a participant
  const isParticipant = virtualSpace.participants.some(
    p => p.user.toString() === req.user.id
  );

  if (!isParticipant) {
    return next(
      new ErrorResponse(`User is not a participant in this virtual space`, 401)
    );
  }

  // Add message
  await virtualSpace.addMessage(req.user.id, req.body.text);

  // Award small XP for active participation
  if (Math.random() < 0.1) { // 10% chance to get XP for messages to avoid spam
    const user = await User.findById(req.user.id);
    await user.addXp(2);
  }

  res.status(201).json({
    success: true,
    data: virtualSpace.messages
  });
});

// @desc    Add resource to virtual space
// @route   POST /api/virtual-spaces/:id/resources
// @access  Private
export const addResource = asyncHandler(async (req, res, next) => {
  const virtualSpace = await VirtualSpace.findById(req.params.id);

  if (!virtualSpace) {
    return next(
      new ErrorResponse(`Virtual space not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is a participant
  const isParticipant = virtualSpace.participants.some(
    p => p.user.toString() === req.user.id
  );

  if (!isParticipant) {
    return next(
      new ErrorResponse(`User is not a participant in this virtual space`, 401)
    );
  }

  // Add resource
  virtualSpace.resources.push({
    title: req.body.title,
    type: req.body.type,
    url: req.body.url,
    uploadedBy: req.user.id
  });

  await virtualSpace.save();

  // Award XP for sharing resources
  const user = await User.findById(req.user.id);
  await user.addXp(10);

  res.status(201).json({
    success: true,
    data: virtualSpace.resources
  });
});

// @desc    Update current topic
// @route   PUT /api/virtual-spaces/:id/topic
// @access  Private
export const updateTopic = asyncHandler(async (req, res, next) => {
  const virtualSpace = await VirtualSpace.findById(req.params.id);

  if (!virtualSpace) {
    return next(
      new ErrorResponse(`Virtual space not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is host or moderator
  const participant = virtualSpace.participants.find(
    p => p.user.toString() === req.user.id
  );

  if (!participant || (participant.role !== 'Host' && participant.role !== 'Moderator')) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update the topic`,
        401
      )
    );
  }

  // Update current topic
  virtualSpace.currentTopic = {
    title: req.body.title,
    description: req.body.description,
    startTime: Date.now(),
    duration: req.body.duration || 30,
    status: 'In Progress'
  };

  await virtualSpace.save();

  res.status(200).json({
    success: true,
    data: virtualSpace.currentTopic
  });
});

// @desc    Add idea to virtual space
// @route   PUT /api/virtual-spaces/:id/ideas/:ideaId
// @access  Private
export const addIdea = asyncHandler(async (req, res, next) => {
  const virtualSpace = await VirtualSpace.findById(req.params.id);

  if (!virtualSpace) {
    return next(
      new ErrorResponse(`Virtual space not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is a participant
  const isParticipant = virtualSpace.participants.some(
    p => p.user.toString() === req.user.id
  );

  if (!isParticipant) {
    return next(
      new ErrorResponse(`User is not a participant in this virtual space`, 401)
    );
  }

  // Check if idea already exists in the space
  const ideaExists = virtualSpace.ideas.some(
    idea => idea.toString() === req.params.ideaId
  );

  if (ideaExists) {
    return next(
      new ErrorResponse(`Idea already exists in this virtual space`, 400)
    );
  }

  // Add idea to virtual space
  virtualSpace.ideas.push(req.params.ideaId);
  await virtualSpace.save();

  // Award XP for sharing ideas in a virtual space
  const user = await User.findById(req.user.id);
  await user.addXp(20);

  res.status(200).json({
    success: true,
    data: virtualSpace.ideas
  });
});
