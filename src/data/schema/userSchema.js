/**
 * @summary   Defines the schema for the user
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

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
    required: [true, 'passwordHash is required'],
  },
  seenMovies: {
    type: [Number],
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpires: {
    type: Date,
  },
}, options);
