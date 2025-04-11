import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a leaderboard name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  category: {
    type: String,
    enum: ['XP', 'Ideas', 'Collaboration', 'Reputation', 'Skills', 'Custom'],
    required: true
  },
  metric: {
    type: String,
    required: true
  },
  timeframe: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'AllTime'],
    default: 'Weekly'
  },
  entries: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    rank: Number,
    previousRank: Number,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Method to update leaderboard entries
LeaderboardSchema.methods.updateEntries = async function(entries) {
  // Sort entries by score in descending order
  entries.sort((a, b) => b.score - a.score);
  
  // Assign ranks
  entries.forEach((entry, index) => {
    // Store previous rank if it exists
    const existingEntry = this.entries.find(e => 
      e.user.toString() === entry.user.toString()
    );
    
    if (existingEntry) {
      entry.previousRank = existingEntry.rank;
    } else {
      entry.previousRank = null;
    }
    
    entry.rank = index + 1;
    entry.updatedAt = Date.now();
  });
  
  this.entries = entries;
  this.lastUpdated = Date.now();
  
  await this.save();
  return this;
};

export default mongoose.model('Leaderboard', LeaderboardSchema);
