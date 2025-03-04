import { NextApiRequest, NextApiResponse } from "next";
import redis from "@/lib/redis";
import { checkRedisConnection } from "@/lib/redis-utils";

interface BookData {
  title: string;
  rating: string;
  author: string;
  blurb: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if Redis is connected
    await checkRedisConnection();

    if (req.method === "POST") {
      // Use req.body directly - Next.js already parses JSON for you
      const { title, rating, author, blurb }: BookData = req.body;

      // Validate the data
      if (!title || !rating || !author || !blurb) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Generate a unique ID for the book
      const id = Math.floor(Math.random() * 100000);

      // Store the book data in Redis
      await redis.hset(`Book:${id}`, { title, rating, author, blurb });

      // Return a success response
      return res.status(201).json({ message: "Book created successfully", id });
    } else {
      // Handle unsupported HTTP methods
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Redis error:", error);

    // Handle Redis connection errors
    if (error instanceof Error && error.message === "Redis is not connected. Please check the Redis server.") {
      return res.status(500).json({ message: error.message });
    }

    // Fallback for other errors
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}