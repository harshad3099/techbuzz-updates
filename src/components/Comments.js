import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const Comments = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    const fetchComments = async () => {
      if (!user) {
        console.log("User not authenticated");
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, `blogs/${blogId}/comments`));
        const commentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [user, db, blogId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.log("User not authenticated");
      return;
    }
    try {
      await addDoc(collection(db, `blogs/${blogId}/comments`), {
        text: comment,
        author: user.displayName,
        createdAt: new Date()
      });
      setComment('');
      // Fetch comments again after adding a new one
      const fetchComments = async () => {
        if (!user) {
          console.log("User not authenticated");
          return;
        }
        try {
          const querySnapshot = await getDocs(collection(db, `blogs/${blogId}/comments`));
          const commentsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setComments(commentsData);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.author}: {comment.text}</p>
        </div>
      ))}
      {user && (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">Add Comment</button>
        </form>
      )}
    </div>
  );
};

export default Comments;
