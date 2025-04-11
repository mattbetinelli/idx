import mongoose from 'mongoose';

// Idea interface
interface IIdea extends mongoose.Document {
  title: string;
  description: string;
  creator: mongoose.Schema.Types.ObjectId;
  collaborators: mongoose.Schema.Types.ObjectId[];
  tags: string[];
  category: string;
  status: string;
  likes: number;
  views: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Idea schema
const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'on-hold'],
    default: 'draft'
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IIdea>('Idea', IdeaSchema);
