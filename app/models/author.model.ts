import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
authorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create the model if it doesn't exist, otherwise use the existing one
export const AuthorModel = mongoose.models.Author || mongoose.model('Author', authorSchema); 