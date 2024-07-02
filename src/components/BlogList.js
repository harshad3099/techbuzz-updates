import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const q = query(collection(db, 'blogs'), where('verified', '==', true));
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogsData);
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <h2>Blog List</h2>
      {blogs.map(blog => (
        <div key={blog.id}>
          <h3>{blog.title}</h3>
          <p>{blog.content.substring(0, 100)}...</p>
          <Link to={`/blog/${blog.slug}`}>Read More</Link> {/* Use slug here */}
        </div>
      ))}
    </div>
  );
};

export default BlogList;
