import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import CreateBlog from './components/CreateBlog';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import Profile from './components/Profile';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
