import mongoose from 'mongoose';

const SkillProgressionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technical', 'Creative', 'Business', 'Soft', 'Other'],
    required: true
  },
  level: {
    type: Number,
    min: 1,
    max: 10,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  experienceToNextLevel: {
    type: Number,
    default: 100
  },
  endorsements: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    strength: {
      type: Number,
      min: 1,
      max: 5,
      default: 1
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea'
  }],
  lastUsed: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Method to add experience to a skill
SkillProgressionSchema.methods.addExperience = async function(amount) {
  this.experience += amount;
  this.updatedAt = Date.now();
  this.lastUsed = Date.now();
  
  // Check for level up
  while (this.experience >= this.experienceToNextLevel) {
    this.experience -= this.experienceToNextLevel;
    this.level += 1;
    
    // Increase experience required for next level
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
  }
  
  await this.save();
  return this;
};

// Method to add endorsement
SkillProgressionSchema.methods.addEndorsement = async function(userId, strength) {
  // Check if user has already endorsed
  const existingEndorsement = this.endorsements.find(
    e => e.user.toString() === userId.toString()
  );
  
  if (existingEndorsement) {
    // Update existing endorsement
    existingEndorsement.strength = strength;
    existingEndorsement.date = Date.now();
  } else {
    // Add new endorsement
    this.endorsements.push({
      user: userId,
      strength,
      date: Date.now()
    });
  }
  
  // Add experience based on endorsement strength
  await this.addExperience(strength * 10);
  
  return this;
};

export default mongoose.model('SkillProgression', SkillProgressionSchema);
