"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import { redirect } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from '../components/Client';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {user,setUser} = useAuth()

  const handleSignup = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log(data)
      if (!data.success) return toast.error(data.message);
      setUser(data?.person);
      toast.success(data.message);
      redirect('/')
    } catch (error) {
      return toast.error(error.message);
    }
  };

  if (user?._id) return redirect("/");

  return (
    <div style={{ maxWidth: '300px', margin: 'auto',marginTop:"100px", padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <Head>
        <title>Signup</title>
      </Head>
      <h2 style={{ marginBottom: '20px' }}>Signup</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
      />
      
      <button onClick={handleSignup} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Sign Up</button>
    </div>
  );
};

export default Signup;
