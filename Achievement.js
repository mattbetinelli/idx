import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an achievement name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  icon: {
    type: String,
    default: 'trophy'
  },
  category: {
    type: String,
    enum: ['Participation', 'Creation', 'Collaboration', 'Recognition', 'Milestone'],
    required: true
  },
  xpReward: {
    type: Number,
    default: 0
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Achievement', AchievementSchema);
