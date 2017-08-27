import mongoose from 'mongoose';
import userSchema from '../schema/user';

/**
 * Model for 'User' MongoDB collection
 */
export default mongoose.model('User', userSchema);
