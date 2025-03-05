import { createClient } from 'redis';

const createRedisClient = () => {
  const client = createClient({
    url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
  });

  client.on('error', (err) => console.error('Redis Client Error', err));

  return client;
};

const globalForRedis = globalThis as unknown as { 
  redis: ReturnType<typeof createRedisClient> | undefined 
};

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Connect to Redis
(async () => {
  try {
    await redis.connect();
    console.log('Redis connected successfully');
  } catch (err) {
    console.error('Failed to connect to Redis', err);
  }
})();

export default redis;