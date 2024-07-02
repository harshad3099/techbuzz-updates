import React, { useState, useRef } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import slugify from '../utils/slugify';

const CreateBlog = () => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const quillRef = useRef(null);
  const db = getFirestore();
  const storage = getStorage();

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.insertEmbed(range.index, 'image', downloadURL);
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = slugify(title);
    try {
      await addDoc(collection(db, 'blogs'), {
        title,
        content,
        category,
        authorId: user.uid,
        authorName: user.displayName,
        createdAt: new Date(),
        verified: false,
        likes: [],
        slug,
      });
      alert('Blog submitted for verification!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Create Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          placeholder="Write your content here..."
          modules={modules}
          formats={[
            'header', 'font',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet',
            'link', 'image', 'video'
          ]}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="technology">Technology</option>
          <option value="gadgets">Gadgets</option>
          <option value="reviews">Reviews</option>
        </select>
        <button type="submit">Submit for Verification</button>
      </form>
    </div>
  );
};

export default CreateBlog;
