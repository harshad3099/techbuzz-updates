import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Header = () => {
  const [navActive, setNavActive] = useState(false);
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">TechBuzz Updates</Link>
      </div>
      <nav className={`nav ${navActive ? 'active' : ''}`}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/blogs">Blogs</Link></li>
          {user && (
            <>
              <li><Link to="/create-blog">Create Blog</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
          {!user && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
      <div className="nav-toggle" onClick={() => setNavActive(!navActive)}>
        ☰
      </div>
    </header>
  );
};

export default Header;
