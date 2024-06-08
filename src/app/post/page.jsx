"use client"
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {  useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const NewPost = () => {
  const router = useRouter()
  const [title, setTitle] = useState('');
  const [text, setText] = useState('Post');
  const [disable, setDisable] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [name,setName] = useState(null)
  const [id,setID] = useState(null)

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const loadVariable=async ()=>{
    const res = await fetch('api/auth/envShare');
    const data = await res.json();
    if(!data.success){
      return toast.error(data.message)
    }
    setName(data.cloudName)
    setID(data.cloudID)
  }

  useEffect(()=>{
    loadVariable();
  },[])

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    setText("Posting...")
    setDisable(true);
    if (!title || !description || !image) {
      return toast.error("All Fields Are Req")
    }
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", id);
    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${name}/auto/upload`, { // replace with your Cloudinary cloud name
      method: "POST",
      body: formData,
    });
    const cloudinaryData = await cloudinaryRes.json();
    try {
      const res = await fetch("/api/auth/post", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc: description,
          file: cloudinaryData.url
        })
      });

      const data = await res.json();
      if (!data.success) return toast.error(data.message);
      toast.success(data.message);
      setText("Post")
      setDisable(false);
      setTitle('');
      setDescription('');
      setImage(null);
      router.push('/posts')
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', marginTop: "100px", padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <Head>
        <title>New Post</title>
      </Head>
      <h1 style={{ textAlign: 'center' }}>New Post</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} enctype="multipart/form-data">
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label>
          <input type="text" value={title} onChange={handleTitleChange} style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea value={description} onChange={handleDescriptionChange} style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }}></textarea>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: "50px" }}>Image:</label>
          <input type="file" name="file" onChange={handleImageChange} accept="image/*" style={{ marginBottom: '10px' }} />
        </div>
        <button disabled={disable} type="submit" style={{ width: '100%', padding: '10px', backgroundColor: disable ? 'red': '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{text}</button>
    </form>
    </div >
  );
};

export default NewPost;