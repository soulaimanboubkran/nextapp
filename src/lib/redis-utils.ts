import redis from './redis'; // Import the Redis client

let isRedisConnected = false;

/**
 * Checks if Redis is connected and attempts to reconnect if necessary.
 * Throws an error if the connection cannot be established.
 */
export async function checkRedisConnection() {
  if (isRedisConnected) {
    return; // Skip the check if Redis is already connected
  }

  try {
    // Check if Redis is not open or ready
    if (!redis.isOpen || !redis.isReady) {
      console.log('Redis connection is closed. Attempting to reconnect...');
      await redis.connect(); // Explicitly reconnect
    }

    // Verify the connection by sending a PING command
    await redis.ping();
    isRedisConnected = true; // Update the connection status
  } catch (error) {
    console.error('Redis ping failed:', error);

    // Throw a custom error with a meaningful message
    throw new Error('Redis is not connected. Please check the Redis server.');
  }
}