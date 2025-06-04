const { createClient } = require('redis');

let redisClient;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient();
    redisClient.on('error', (err) => console.error('[REDIS ERROR]', err));
    redisClient.on('connect', () => console.log('[REDIS CONNECTED]'));
    await redisClient.connect();
  }
  return redisClient;
}

module.exports = getRedisClient;
