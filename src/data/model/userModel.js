/**
 * @summary   Defines the model for the user
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import mongoose from 'mongoose';
import userSchema from '../schema/userSchema';

userSchema.statics.publicProjection = function publicProjection() {
  return {
    _id: 0,
    username: 1,
    email: 1,
    seenMovies: 1,
  };
};

/**
 * Model for 'User' MongoDB collection
 */
export default mongoose.model('User', userSchema);
