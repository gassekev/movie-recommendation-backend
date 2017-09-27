import jwtExpress from 'express-jwt';
import config from 'config';

export default jwtExpress({
  secret: config.get('jwt.secret'),
  requestProperty: 'auth' });
