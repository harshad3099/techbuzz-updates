import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

const LikeButton = ({ blogId }) => {
  const [user] = useAuthState(auth);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user) return;
      const likeDoc = await getDoc(doc(db, `blogs/${blogId}/likes`, user.uid));
      setLiked(likeDoc.exists());
    };

    const fetchLikeCount = async () => {
      const likesCollection = collection(db, `blogs/${blogId}/likes`);
      const likesSnapshot = await getDocs(likesCollection);
      setLikeCount(likesSnapshot.size);
    };

    checkIfLiked();
    fetchLikeCount();
  }, [user, blogId, db]);

  const handleLike = async () => {
    if (!user) {
      console.log("User not authenticated");
      return;
    }
    const likeRef = doc(db, `blogs/${blogId}/likes`, user.uid);
    try {
      if (liked) {
        await deleteDoc(likeRef);
        setLikeCount(likeCount - 1);
      } else {
        await setDoc(likeRef, { liked: true });
        setLikeCount(likeCount + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return (
    <>
      <button onClick={handleLike}>
        {liked ? "Unlike" : "Like"}
      </button>
      <p>Likes: {likeCount}</p>
    </>
  );
};

export default LikeButton;
