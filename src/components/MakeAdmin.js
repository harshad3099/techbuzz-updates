import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const MakeAdmin = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user && user[0]) {
        const docRef = doc(db, 'roles', user[0].uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkAdmin();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setMessage('Unauthorized: Only admins can make other admins.');
      return;
    }
    try {
      const userRef = doc(db, 'roles', email);
      await setDoc(userRef, { role: 'admin' });
      setMessage(`Success! ${email} has been made an admin.`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Make Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Make Admin</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MakeAdmin;
