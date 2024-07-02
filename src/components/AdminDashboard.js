import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const AdminDashboard = () => {
  const [user] = useAuthState(auth);
  const [blogs, setBlogs] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchBlogs = async () => {
      const q = query(collection(db, 'blogs'), where('verified', '==', false));
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogsData);
    };
    fetchBlogs();
  }, [db]);

  const handleVerify = async (id) => {
    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, {
      verified: true,
    });
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Assume isAdmin is a field in the user's profile that determines admin status
  if (!user?.isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <h3>Pending Blogs for Verification</h3>
      {blogs.map(blog => (
        <div key={blog.id}>
          <h4>{blog.title}</h4>
          <p>{blog.content}</p>
          <button onClick={() => handleVerify(blog.id)}>Verify</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
