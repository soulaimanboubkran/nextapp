import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  retryStrategy: (times) => {
    if (times > 20) {
      console.error('Redis: Too many retries, stopping reconnection.');
      return null; // Stop retrying after 5 attempts
    }
    const delay = 60000; // Retry every 1 minute (60,000ms)
    console.warn(`Redis connection failed. Retrying in ${delay / 1000} seconds...`);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('Redis connected successfully.');
});

redis.on('error', () => {
  console.error('Redis connection error:');
});

export default redis;
