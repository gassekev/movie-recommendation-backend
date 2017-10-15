/**
 * @summary   Create redis client
 * @author    Kevin Gasser, Simon Müller, Tobias Huonder
*/

import redis from 'redis';
import config from 'config';

const uri = config.get('redis.uri');

const options = {
  password: config.get('redis.password'),
};

const client = redis.createClient(uri, options);

client.on('error', (err) => {
  console.log(`redis connection error: ${err}`);
});

export default client;
