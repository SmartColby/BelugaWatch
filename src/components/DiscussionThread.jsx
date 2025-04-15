import React, { useState } from 'react';
import '../styles/DiscussionThread.css'; // Import your CSS styles

// Sample data structure for comments
const initialComments = [
  {
    id: 1,
    parentId: null,
    author: 'User1',
    content: 'This is a top-level comment.',
    replies: [
      {
        id: 2,
        parentId: 1,
        author: 'User2',
        content: 'This is a nested comment.',
        replies: [
          {
            id: 3,
            parentId: 2,
            author: 'User3',
            content: 'This is a nested reply.',
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    parentId: null,
    author: 'User4',
    content: 'Another top-level comment.',
    replies: [],
  },
];

// Comment component that renders itself recursively for nested replies
const Comment = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div style={{ marginLeft: comment.parentId ? 20 : 0, border: '1px solid #ccc', padding: 10 }}>
      <p>
        <strong>{comment.author}</strong>: {comment.content}
      </p>
      {comment.replies.length > 0 && (
        <button onClick={() => setShowReplies(!showReplies)}>
          {showReplies ? 'Hide Replies' : 'Show Replies'}
        </button>
      )}
      {showReplies &&
        comment.replies.map((reply) => <Comment key={reply.id} comment={reply} />)}
    </div>
  );
};

// DiscussionThread component that renders all top-level comments
const DiscussionThread = ({ post, username }) => {
  // Use initialComments to initialize the comments state
  const [comments, setComments] = useState(initialComments);

  // Function to add a new comment
  const addComment = (content, parentId = null) => {
    const newComment = {
      id: Date.now(),
      parentId,
      author: username, // Use the logged-in user's username
      content,
      replies: [],
    };

    if (parentId === null) {
      setComments([...comments, newComment]);
    } else {
      const addReply = (commentsList) => {
        return commentsList.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newComment],
            };
          } else if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReply(comment.replies),
            };
          }
          return comment;
        });
      };
      setComments(addReply(comments));
    }
  };

  return (
    <div>
      <h2>Discussion Thread</h2>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      <button onClick={() => addComment('This is a new top-level comment.')}>
        Add Comment
      </button>
    </div>
  );
};

export default DiscussionThread;
