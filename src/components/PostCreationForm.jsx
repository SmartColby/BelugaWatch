import React, { useState } from "react";
import "../styles/PostCreationForm.css";

const PostCreationForm = ({ onAddPost, username }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost = {
      id: Date.now(),
      author: username, // Use the logged-in user's username
      content,
      comments: [], // Initialize with no comments
    };

    onAddPost(newPost);
    setContent(""); // Clear the input field
  };

  return (
    <form className="post-creation-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Write your post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default PostCreationForm;
