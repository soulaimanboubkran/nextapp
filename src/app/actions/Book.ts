// app/actions/Book.ts
"use server"; // This makes it a Server Action

import redis from "@/lib/redis";

interface BookData {
  title: string;
  rating: string;
  author: string;
  blurb: string;
}

export async function createBook(formData: BookData) {
  const { title, rating, author, blurb } = formData;

  const id = Math.floor(Math.random() * 100000);
  await redis.hset(`Book:${id}`, { title, rating, author, blurb });
}
