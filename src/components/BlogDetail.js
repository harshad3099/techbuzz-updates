import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import LikeButton from './LikeButton';
import Comments from './Comments';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [blogId, setBlogId] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log(`Fetching blog with slug: ${slug}`);
        const q = query(collection(db, 'blogs'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const blogData = querySnapshot.docs[0].data();
          console.log('Blog data fetched:', blogData);
          setBlog(blogData);
          setBlogId(querySnapshot.docs[0].id);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    const fetchLikeCount = async () => {
      if (!blogId) return;
      try {
        console.log(`Fetching like count for blog ID: ${blogId}`);
        const likesCollection = collection(db, `blogs/${blogId}/likes`);
        const likesSnapshot = await getDocs(likesCollection);
        setLikeCount(likesSnapshot.size);
      } catch (error) {
        console.error("Error fetching like count:", error);
      }
    };

    fetchBlog();
    if (blogId) fetchLikeCount();
  }, [slug, blogId]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>
      <p>Author: {blog.authorName}</p>
      <p>Created At: {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>
      <p>Category: {blog.category}</p>
      <p>Likes: {likeCount}</p>
      {blogId && <LikeButton blogId={blogId} />}
      {blogId && <Comments blogId={blogId} />}
    </div>
  );
};

export default BlogDetail;
