"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../components/Client";
import { useRouter } from "next/navigation";

const PostPage = ({ params }) => {
  const [post, setPost] = useState({});
  const router = useRouter();
  const [User, setUser] = useState(null);
  const { user } = useAuth();

  const handlePost = async () => {
    const res = await fetch(`/api/auth/singlePost?id=${params.id}`);
    const data = await res.json();

    if (!data.success) {
      return toast.error(data.message);
    }
    setPost(data.data);
    setUser(data.user.username);
  };

  useEffect(() => {
    handlePost();
  }, []);

  return (
    <div style={{
      maxWidth: '800px',
      margin: 'auto',
      padding: '20px',
      border: '1px solid #000',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#000',
      color: '#fff',
      marginTop: '20px'
    }}>
      <img src={post.file} alt={post.title} style={{
        width: '50%',
        height:"50%",
        borderRadius: '10px',
        marginBottom: '20px',
      }} />
      <h4 style={{
        color: '#aaa',
        marginBottom: '10px'
      }}>{new Date(post.date).toLocaleDateString()}</h4>
      <h3 style={{
        marginBottom: '20px',
        fontSize: '2rem',
        fontWeight: 'bold'
      }}>{post.title}</h3>
      <p style={{
        marginBottom: '20px',
        lineHeight: '1.6',
        fontSize: '1.1rem'
      }}>{post.desc}</p>
      <h4 style={{
        color: '#007bff',
        marginBottom: '20px'
      }}>Posted by: {User}</h4>
      {user?.username === User && (
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={()=>router.push(`/edit/${post._id}`)}
        >Edit</button>
      )}
    </div>
  );
};

export default PostPage;
