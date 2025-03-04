
import { useState } from "react";

const BookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    rating: "",
    author: "",
    blurb: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        // Try to get error details from the response
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
  
      // Get successful response data
      const data = await response.json();
  
      // Reset the form after successful submission
      setFormData({ title: "", rating: "", author: "", blurb: "" });
      alert(`Book created successfully! ID: ${data.id}`);
    } catch (error) {
      console.error("Error creating book:", error);
      alert(`Failed to create book: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
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
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BookForm;