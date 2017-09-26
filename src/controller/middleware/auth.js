import jwtExpress from 'express-jwt';

export default jwtExpress({
  secret: process.env.JWT_SECRET });
