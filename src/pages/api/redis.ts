// src/pages/api/redis.ts
import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      // Handle POST request to set a value in Redis
      const { key, value } = req.body;

      if (!key || !value) {
        return res.status(400).json({ message: 'Key and value are required' });
      }

      await redis.set(key, value);
      return res.status(200).json({ message: 'Value set in Redis', key, value });
    } else if (req.method === 'GET') {
      // Handle GET request to retrieve a value from Redis
      const { key } = req.query;

      if (!key) {
        return res.status(400).json({ message: 'Key is required' });
      }

      const value = await redis.get(key as string);

      if (!value) {
        return res.status(404).json({ message: 'Key not found in Redis' });
      }

      return res.status(200).json({ key, value });
    } else {
      // Handle unsupported HTTP methods
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Redis error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}