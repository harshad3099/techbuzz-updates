import React, { useState } from 'react';
import admin from 'firebase-admin';
import serviceAccount from './path/to/your/serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const AdminSetup = () => {
  const [uid, setUid] = useState('');
  const [message, setMessage] = useState('');

  const setAdminRole = (uid) => {
    admin.auth().setCustomUserClaims(uid, { admin: true })
      .then(() => {
        setMessage(`Success! User with UID: ${uid} has been made an admin.`);
      })
      .catch((error) => {
        setMessage(`Error setting custom user claims: ${error.message}`);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAdminRole(uid);
  };

  return (
    <div>
      <h2>Admin Setup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User UID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          required
        />
        <button type="submit">Set Admin Role</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminSetup;
