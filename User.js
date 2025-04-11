import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    }
  }],
  interests: [String],
  experience: [{
    title: String,
    company: String,
    period: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    period: String
  }],
  // Gamification elements
  level: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  },
  reputation: {
    type: Number,
    default: 0
  },
  achievements: [{
    title: String,
    description: String,
    icon: String,
    dateEarned: {
      type: Date,
      default: Date.now
    }
  }],
  hourBank: {
    hours: {
      type: Number,
      default: 0
    },
    transactions: [{
      amount: Number,
      description: String,
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },
  connections: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  ideas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea'
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate XP needed for next level
UserSchema.methods.getNextLevelXp = function() {
  // Simple formula: 100 * current level
  return this.level * 100;
};

// Check if user has enough XP to level up
UserSchema.methods.checkLevelUp = function() {
  const nextLevelXp = this.getNextLevelXp();
  if (this.xp >= nextLevelXp) {
    this.level += 1;
    return true;
  }
  return false;
};

// Add XP to user
UserSchema.methods.addXp = async function(amount) {
  this.xp += amount;
  
  // Check for level up
  while (this.checkLevelUp()) {
    // Level up logic can be expanded here
    console.log(`User ${this._id} leveled up to ${this.level}`);
  }
  
  await this.save();
  return this;
};

export default mongoose.model('User', UserSchema);
