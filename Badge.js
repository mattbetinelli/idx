import mongoose from 'mongoose';

const BadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a badge name'],
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
    required: true
  },
  category: {
    type: String,
    enum: ['Skill', 'Contribution', 'Community', 'Special'],
    required: true
  },
  level: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  displayColor: {
    type: String,
    default: '#6c757d' // Default gray color
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isDisplayable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Badge', BadgeSchema);
