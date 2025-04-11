import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  problemStatement: {
    type: String,
    required: [true, 'Please provide a problem statement'],
    maxlength: [2000, 'Problem statement cannot be more than 2000 characters']
  },
  solution: {
    type: String,
    required: [true, 'Please provide a solution'],
    maxlength: [2000, 'Solution cannot be more than 2000 characters']
  },
  features: [{
    title: String,
    description: String
  }],
  targetMarket: {
    primary: String,
    secondary: String
  },
  technicalRequirements: [String],
  currentStatus: {
    type: String,
    maxlength: [2000, 'Current status cannot be more than 2000 characters']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  status: {
    type: String,
    enum: ['Draft', 'Active', 'In Progress', 'Completed', 'Archived'],
    default: 'Draft'
  },
  stage: {
    type: String,
    enum: ['Concept', 'Validation', 'Development', 'Team Building', 'Launch'],
    default: 'Concept'
  },
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Connections'],
    default: 'Public'
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String,
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  openPositions: [{
    title: String,
    description: String,
    skills: [String],
    isOpen: {
      type: Boolean,
      default: true
    }
  }],
  updates: [{
    title: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    text: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    replies: [{
      text: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    date: {
      type: Date,
      default: Date.now
    }
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    innovation: {
      type: Number,
      min: 1,
      max: 5
    },
    feasibility: {
      type: Number,
      min: 1,
      max: 5
    },
    marketPotential: {
      type: Number,
      min: 1,
      max: 5
    },
    impact: {
      type: Number,
      min: 1,
      max: 5
    },
    overall: {
      type: Number,
      min: 1,
      max: 5
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRatings: {
    innovation: {
      type: Number,
      default: 0
    },
    feasibility: {
      type: Number,
      default: 0
    },
    marketPotential: {
      type: Number,
      default: 0
    },
    impact: {
      type: Number,
      default: 0
    },
    overall: {
      type: Number,
      default: 0
    }
  },
  completion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  relatedIdeas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea'
  }],
  relatedSpaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VirtualSpace'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average ratings when a new rating is added
IdeaSchema.methods.calculateAverageRatings = function() {
  if (this.ratings.length === 0) {
    this.averageRatings = {
      innovation: 0,
      feasibility: 0,
      marketPotential: 0,
      impact: 0,
      overall: 0
    };
    return;
  }

  const totalRatings = {
    innovation: 0,
    feasibility: 0,
    marketPotential: 0,
    impact: 0,
    overall: 0
  };

  this.ratings.forEach(rating => {
    totalRatings.innovation += rating.innovation || 0;
    totalRatings.feasibility += rating.feasibility || 0;
    totalRatings.marketPotential += rating.marketPotential || 0;
    totalRatings.impact += rating.impact || 0;
    totalRatings.overall += rating.overall || 0;
  });

  const count = this.ratings.length;
  this.averageRatings = {
    innovation: parseFloat((totalRatings.innovation / count).toFixed(1)),
    feasibility: parseFloat((totalRatings.feasibility / count).toFixed(1)),
    marketPotential: parseFloat((totalRatings.marketPotential / count).toFixed(1)),
    impact: parseFloat((totalRatings.impact / count).toFixed(1)),
    overall: parseFloat((totalRatings.overall / count).toFixed(1))
  };
};

// Update timestamps on save
IdeaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average ratings before saving
IdeaSchema.pre('save', function(next) {
  if (this.isModified('ratings')) {
    this.calculateAverageRatings();
  }
  next();
});

export default mongoose.model('Idea', IdeaSchema);
