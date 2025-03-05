'use client';

import { useState, useEffect } from 'react';

interface Book {
  id: string;
  title: string;
  rating: string;
  author: string;
  blurb: string;
}

export default function BookForm() {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    rating: "",
    author: "",
    blurb: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/book');
        const data = await response.json();
        
        if (data.success) {
          setBooks(data.books);
        } else {
          setError(data.message || 'Failed to fetch books');
        }
      } catch (err) {
        setError('Error fetching books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Refetch books to update the list
        const booksResponse = await fetch('/api/book');
        const booksData = await booksResponse.json();
        
        if (booksData.success) {
          setBooks(booksData.books);
        }

        // Reset form
        setFormData({
          title: "",
          rating: "",
          author: "",
          blurb: "",
        });
      } else {
        setError(data.message || 'Failed to create book');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading books...</div>;
  }

  return (
    <>
      <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <h2 className="text-xl font-bold mb-4">Create a New Book</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="blurb"
            placeholder="Blurb"
            value={formData.blurb}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Create Book'}
          </button>
        </form>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Book Collection</h2>
        {books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="border p-4 rounded-lg shadow-md"
              >
                <h3 className="font-bold text-xl mb-2">{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Rating:</strong> {book.rating}</p>
                <p className="mt-2 text-gray-600">{book.blurb}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}