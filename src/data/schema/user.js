import mongoose from 'mongoose';

/**
 * User Mongoose Schema
 */
const options = {
  timestamps: true,
};

export default mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
  },
  passwordHash: {
    type: String,
    default: null,
  },
  seenMovies: {
    type: [String],
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, options);
