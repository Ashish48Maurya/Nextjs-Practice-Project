"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Head from "next/head";

const EditPage = ({ params }) => {
    const router = useRouter()
    const [title, setTitle] = useState('');
    const [text, setText] = useState('Post');
    const [disable, setDisable] = useState(false);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [name,setName] = useState(null)
    const [id,setID] = useState(null)
    const [postId,setPostId] = useState(null);

  const handlePost = async () => {
    const res = await fetch(`/api/auth/singlePost?id=${params.id}`);
    const data = await res.json();

    if (!data.success) {
      return toast.error(data.message);
    }
    setTitle(data.data.title)
    setDescription(data.data.desc)
    setPostId(data.data._id)
  };

  const loadVariable=async ()=>{
    console.log("LOAD Var...")
    const res = await fetch('/api/auth/envShare');
    const data = await res.json();
    if(!data.success){
      return toast.error(data.message)
    }
    setName(data.cloudName)
    setID(data.cloudID)
  }


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
    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${name}/auto/upload`, {
      method: "POST",
      body: formData,
    });
    const cloudinaryData = await cloudinaryRes.json();
    try {
      const res = await fetch(`/api/auth/post?id=${postId}`, {
        method: "PUT",
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

  useEffect(() => {
    loadVariable();
    handlePost();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', marginTop: "100px", padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <Head>
        <title>Create Post</title>
      </Head>
      <h3 style={{ textAlign: 'center' }}>Create Post</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }} enctype="multipart/form-data">
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #ccc' }}></textarea>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: "50px" }}>Image:</label>
          <input type="file" name="file" onChange={(e)=>setImage(e.target.files[0])} accept="image/*" style={{ marginBottom: '10px' }} />
        </div>
        <button disabled={disable} type="submit" style={{ width: '100%', padding: '10px', backgroundColor: disable ? 'red': '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{text}</button>
    </form>
    </div >
  );
};

export default EditPage;
