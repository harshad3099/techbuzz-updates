import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Profile = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <div>
          <p>Display Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
