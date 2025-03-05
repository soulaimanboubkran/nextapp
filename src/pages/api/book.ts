import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/lib/redis';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const { title, rating, author, blurb } = req.body;

      // Validate input
      if (!title || !rating || !author || !blurb) {
        return res.status(400).json({ 
          success: false, 
          message: 'All fields are required' 
        });
      }

      // Generate unique ID
      const id = Date.now().toString();

      // Store book details
      await redis.hSet(`Book:${id}`, {
        id,
        title,
        rating,
        author,
        blurb,
      });

      // Add to sorted set
      await redis.zAdd('books', {
        score: Date.now(),
        value: id,
      });

      return res.status(201).json({
        success: true,
        message: 'Book created successfully',
        id,
      });
    }

    if (req.method === 'GET') {
      // Get books from sorted set with their scores
      const result = await redis.zRangeWithScores('books', 0, -1);
      
      // Extract book IDs (scores) from the result
      const books = await Promise.all(
        result.map(async (book) => {
          // Retrieve full book details using the score (ID)
          const bookDetails = await redis.hGetAll(`Book:${book.score}`);
          
          // Add the ID to the book details
          return {
            ...bookDetails,
            id: book.score.toString()
          };
        })
      );
    
      return res.status(200).json({
        success: true,
        books
      });
    }

    // Unsupported methods
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  } catch (error) {
    console.error('Book API error:', error);
    return res.status(500).json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}