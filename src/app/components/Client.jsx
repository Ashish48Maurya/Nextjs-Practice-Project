"use client"
import Link from 'next/link';
import styles from '../Navbar.module.css'
import { toast } from "react-hot-toast";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Cookie': document.cookie,
                    },
                });
                const data = await res.json();
                setUser(data.message);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return authContextValue;
};



export const Navbar = () => {
    const { user, setUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const logoutHandler = async () => {
        try {
            const res = await fetch("/api/auth/logout");
            const data = await res.json();
            if (!data.success) toast.error(data.message);
            setUser({});
            toast.success(data.message);
            router.refresh()
            router.push('/login')
        } catch (error) {
            return toast.error(error.message);
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/">
                    <div className={styles.brand}>Blogify</div>
                </Link>
                <div className={`${styles.menu} ${isOpen ? styles.open : ''}`} onClick={toggleMenu}>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </div>
                <ul className={`${styles.navLinks} ${isOpen ? styles.show : ''}`} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <li className={styles.navItem}>
                        <Link href="/">
                            <div className={styles.navLink}>Home</div>
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/post">
                            <div className={styles.navLink}>CreatePost</div>
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/posts">
                            <div className={styles.navLink}>SeePosts</div>
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        {user?._id ?
                            <button className={styles.navLink} style={{ width: '100%', padding: "10px", backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={logoutHandler}>Logout</button>
                            : <Link href="/login">
                                <div className={styles.navLink}>Login</div>
                            </Link>
                        }
                    </li>
                </ul>
            </div>
        </nav>
    );
}


export const Posts = () => {
    const [posts, setPost] = useState([]);
    const postsData = async () => {
        try {
            const res = await fetch("/api/auth/post", {
                method: "GET",
            });
            const data = await res.json();
            if (!data.success) return toast.error(data.message);
            setPost(data.data);
        } catch (error) {
            return toast.error(error.message);
        }
    };
    const truncateText = (text, wordLimit) => {
        const words = text.split(" ");
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(" ") + "...";
        }
        return text;
    };

    useEffect(() => {
        postsData();
    }, [])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {posts?.map((post) => (
                    <div key={post._id} style={{ maxWidth: '300px', margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <img src={post.file} alt={post.file} style={{ width: '100%', marginBottom: '10px', borderRadius: '5px' }} />
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "5px" }}>
                            <h4>Created At: {new Date(post.date).toLocaleDateString()}</h4>
                            <h4>Created By: {post.user.username}</h4>
                        </div>
                        <h3 style={{ marginBottom: '10px', fontSize: '1.5rem' }}>{truncateText(post.title, 10)}</h3>
                        <p style={{ marginBottom: '10px' }}>{truncateText(post.desc, 30)}</p>
                        <Link href={`/post/${post._id}`}>
                            <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Read More</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const Home = () => {
    const { user } = useAuth();
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh" }}>
            <h2 style={{ margin: "10px", color: "orangered" }}>Welcome</h2>
            {user._id ? <h1 style={{ color: "yellow" }}>{user.username}</h1> : <h1 style={{ color: "yellow" }}>User</h1>}
        </div>
    )
}